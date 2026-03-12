"""
Agent 3 — Trend & Forecast Agent
==================================
Receives this week's analytics (Agent 2 output) + historical weekly records from MySQL.
Runs 6 algorithms to compute trend, forecast, and risk.
Returns enriched supplier objects ready for MySQL storage.
No DB access. Pure computation.
"""

import math
import statistics
from datetime import date

_RATING_LABELS = {
    "A": "Strategic Partner",
    "B": "Reliable",
    "C": "Needs Intervention",
    "D": "Critical Risk",
}


def _assign_rating(score: float | None) -> tuple[str | None, str | None]:
    if score is None:
        return None, "Unrated"
    if score >= 95:
        return "A", _RATING_LABELS["A"]
    if score >= 85:
        return "B", _RATING_LABELS["B"]
    if score >= 70:
        return "C", _RATING_LABELS["C"]
    return "D", _RATING_LABELS["D"]


def _linear_slope(y: list[float]) -> float:
    """Least-squares slope for y values (x = 1, 2, …, n)."""
    n = len(y)
    if n < 2:
        return 0.0
    x = list(range(1, n + 1))
    sx  = sum(x)
    sy  = sum(y)
    sxy = sum(xi * yi for xi, yi in zip(x, y))
    sx2 = sum(xi * xi for xi in x)
    denom = n * sx2 - sx * sx
    return (n * sxy - sx * sy) / denom if denom else 0.0


def _std_dev(values: list[float]) -> float:
    if len(values) < 2:
        return 0.0
    return statistics.stdev(values)


def _analyse_supplier(
    current: dict,
    history: list[dict],
    today: str,
) -> dict:
    """
    current: one supplier dict from Agent 2 supplier_analytics
    history: list of past WeeklyScore-like dicts sorted oldest→newest
             Each: {week_start_date, otd_pct, fr_pct, qr_pct, composite_score, rating}
    today:   YYYY-MM-DD string
    """
    flags: list[str] = []
    n_hist = len(history)
    hist_scores = [h["composite_score"] for h in history if h.get("composite_score") is not None]

    cur_score = current["score"]["composite_score"]
    cur_otd   = current["kpis"]["otd_pct"]
    cur_fr    = current["kpis"]["fr_pct"]
    cur_qr    = current["kpis"]["qr_pct"]

    # All scores: history + current
    all_scores = hist_scores + ([cur_score] if cur_score is not None else [])

    # ── Algorithm 1: WoW Change ────────────────────────────────────────────────
    wow_change: float | None = None
    wow_direction: str | None = None
    if n_hist >= 1 and hist_scores and cur_score is not None:
        wow_change = round(cur_score - hist_scores[-1], 2)
        if wow_change >= 5:
            wow_direction = "Improving"
        elif wow_change <= -5:
            wow_direction = "Declining"
        else:
            wow_direction = "Stable"

    # ── Algorithm 2: 30-day Trend (4 weeks) ───────────────────────────────────
    trend_30d: str | None = None
    if n_hist >= 3 and len(all_scores) >= 4:
        last4 = all_scores[-4:]
        sd = _std_dev(last4)
        if sd > 8.0:
            trend_30d = "Erratic"
        else:
            slope = _linear_slope(last4)
            if slope > 1.0:
                trend_30d = "Improving"
            elif slope < -1.0:
                trend_30d = "Declining"
            else:
                trend_30d = "Stable"
    elif n_hist == 0:
        trend_30d = "Insufficient Data"
    elif n_hist < 3:
        trend_30d = "Early Stage"

    # ── Algorithm 3: Silent Drop ───────────────────────────────────────────────
    silent_drop_flag = False
    silent_drop_magnitude: float | None = None
    silent_drop_alert: str | None = None
    if len(all_scores) >= 4:
        last4 = all_scores[-4:]
        strictly_dec = all(last4[i] > last4[i + 1] for i in range(3))
        magnitude = round(last4[0] - last4[3], 2)
        if strictly_dec and magnitude >= 8:
            silent_drop_flag = True
            silent_drop_magnitude = magnitude
            silent_drop_alert = (
                f"WARNING: Consistent decline of {magnitude} points over 4 weeks"
            )

    # ── Algorithm 4: Forecast ──────────────────────────────────────────────────
    forecast_score: float | None = None
    forecast_rating: str | None = None
    forecast_confidence: str | None = None
    if len(all_scores) >= 3 and cur_score is not None:
        changes = [all_scores[i + 1] - all_scores[i] for i in range(len(all_scores) - 1)]
        avg_change = sum(changes) / len(changes)
        raw_forecast = cur_score + avg_change
        forecast_score = round(min(100.0, max(0.0, raw_forecast)), 2)
        forecast_rating, _ = _assign_rating(forecast_score)
        n_pts = len(all_scores)
        if n_pts <= 3:
            forecast_confidence = "Low"
        elif n_pts <= 5:
            forecast_confidence = "Medium"
        else:
            forecast_confidence = "High"

    # ── Algorithm 5: Per-metric Trends ────────────────────────────────────────
    metric_trends = {"otd": None, "fr": None, "qr": None}
    if n_hist >= 2:
        hist_otd = [h["otd_pct"] for h in history[-2:] if h.get("otd_pct") is not None]
        hist_fr  = [h["fr_pct"]  for h in history[-2:] if h.get("fr_pct")  is not None]
        hist_qr  = [h["qr_pct"]  for h in history[-2:] if h.get("qr_pct")  is not None]

        def _metric_trend_higher_better(hist: list[float], cur: float | None, thresh: float = 3.0) -> str | None:
            if cur is None or not hist:
                return None
            change = cur - hist[0]
            if change >= thresh:
                return "Improving"
            if change <= -thresh:
                return "Declining"
            return "Stable"

        def _metric_trend_lower_better(hist: list[float], cur: float | None, thresh: float = 2.0) -> str | None:
            """QR: lower is better, so increase = Worsening."""
            if cur is None or not hist:
                return None
            change = cur - hist[0]
            if change >= thresh:
                return "Worsening"
            if change <= -thresh:
                return "Improving"
            return "Stable"

        metric_trends["otd"] = _metric_trend_higher_better(hist_otd, cur_otd)
        metric_trends["fr"]  = _metric_trend_higher_better(hist_fr, cur_fr)
        metric_trends["qr"]  = _metric_trend_lower_better(hist_qr, cur_qr)

    # ── Algorithm 6: Risk Classification ──────────────────────────────────────
    rating = current["score"]["rating"]
    risk_reasons: list[str] = []
    risk_level = "Unknown"

    if n_hist == 0:
        risk_level = "Unknown"
    else:
        # Critical
        if (
            rating == "D"
            or silent_drop_flag
            or (rating == "C" and trend_30d == "Declining")
        ):
            risk_level = "Critical"
            if rating == "D":
                risk_reasons.append("supplier rated D (Critical Risk)")
            if silent_drop_flag:
                risk_reasons.append(f"silent drop of {silent_drop_magnitude} pts over 4 weeks")
            if rating == "C" and trend_30d == "Declining":
                risk_reasons.append("rated C with declining 30-day trend")

        # High
        elif (
            rating == "C"
            or (rating == "B" and silent_drop_flag)
            or (rating == "B" and trend_30d == "Declining" and wow_change is not None and wow_change < -3)
        ):
            risk_level = "High"
            if rating == "C":
                risk_reasons.append("supplier rated C (Needs Intervention)")
            if rating == "B" and silent_drop_flag:
                risk_reasons.append("rated B but silent drop detected")
            if trend_30d == "Declining" and wow_change is not None and wow_change < -3:
                risk_reasons.append("declining trend with WoW drop > 3 pts")

        # Medium
        elif (
            (rating == "B" and trend_30d not in ("Improving",))
            or trend_30d == "Erratic"
        ):
            risk_level = "Medium"
            if rating == "B" and trend_30d not in ("Improving",):
                risk_reasons.append(f"rated B with {trend_30d} trend")
            if trend_30d == "Erratic":
                risk_reasons.append("erratic performance pattern")

        # Low
        elif (
            rating == "A"
            or (rating == "B" and trend_30d in ("Improving", "Stable"))
        ):
            risk_level = "Low"

    return {
        "supplier_id":   current["supplier_id"],
        "supplier_name": current["supplier_name"],
        "category":      current["category"],
        "kpis":          current["kpis"],
        "score":         current["score"],
        "order_stats":   current["order_stats"],
        "trend": {
            "wow_change":            wow_change,
            "wow_direction":         wow_direction,
            "trend_30d":             trend_30d,
            "silent_drop_flag":      silent_drop_flag,
            "silent_drop_magnitude": silent_drop_magnitude,
            "silent_drop_alert":     silent_drop_alert,
            "metric_trends":         metric_trends,
        },
        "forecast": {
            "forecast_score":  forecast_score,
            "forecast_rating": forecast_rating,
            "confidence":      forecast_confidence,
        },
        "risk": {
            "risk_level":   risk_level,
            "risk_reasons": risk_reasons,
        },
        "history_weeks_available": n_hist,
        "_flags": flags + current.get("_flags", []),
    }


# ── Public entry point ─────────────────────────────────────────────────────────
def run(
    analytics_output: dict,
    historical_by_supplier: dict[str, list[dict]],
    today_date: str | None = None,
) -> dict:
    """
    analytics_output: full dict returned by analytics.run()
    historical_by_supplier: {supplier_id: [historical_weekly_records oldest→newest]}
    today_date: YYYY-MM-DD string (defaults to today)
    """
    today = today_date or date.today().isoformat()
    wsd   = analytics_output.get("week_start_date", today)
    current_week_supplier_list = analytics_output.get("supplier_analytics", [])

    supplier_results = []
    new_sids        = set(s["supplier_id"] for s in current_week_supplier_list)
    existing_sids   = set(historical_by_supplier.keys())

    for current in current_week_supplier_list:
        sid     = current["supplier_id"]
        history = historical_by_supplier.get(sid, [])
        enriched = _analyse_supplier(current, history, today)
        enriched["week_start_date"] = wsd
        enriched["weights_snapshot"] = analytics_output.get("weights_used", {})
        supplier_results.append(enriched)

    # Batch summary
    risk_counts = {"Low": 0, "Medium": 0, "High": 0, "Critical": 0, "Unknown": 0}
    rating_dist = {"A": 0, "B": 0, "C": 0, "D": 0}
    silent_drop_count = 0

    for s in supplier_results:
        rl = s["risk"]["risk_level"]
        risk_counts[rl] = risk_counts.get(rl, 0) + 1
        r = s["score"]["rating"]
        if r in rating_dist:
            rating_dist[r] += 1
        if s["trend"]["silent_drop_flag"]:
            silent_drop_count += 1

    return {
        "agent":  "trend_forecast",
        "status": "success",
        "supplier_results": supplier_results,
        "batch_summary": {
            "total_suppliers":    len(supplier_results),
            "new_suppliers":      len(new_sids - existing_sids),
            "returning_suppliers": len(new_sids & existing_sids),
            "critical_risk_count": risk_counts.get("Critical", 0),
            "high_risk_count":     risk_counts.get("High", 0),
            "silent_drop_count":   silent_drop_count,
            "rating_distribution": rating_dist,
        },
    }
