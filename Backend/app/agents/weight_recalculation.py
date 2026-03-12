"""
Weight Recalculation Agent
Triggered when the user saves new evaluation metric weights.
Recalculates every historical composite score, rating, trend, and forecast.
"""

import math


# ── Helpers ───────────────────────────────────────────────────────────────────

def _normalize_weights(w: dict):
    total = w["weight_otd"] + w["weight_fr"] + w["weight_qr"]
    if abs(total - 1.0) < 1e-9:
        return dict(w), []
    return {
        "weight_otd": w["weight_otd"] / total,
        "weight_fr":  w["weight_fr"]  / total,
        "weight_qr":  w["weight_qr"]  / total,
    }, ["weights_normalized"]


def _calc_score(otd, fr, qr, w_otd, w_fr, w_qr):
    """Returns (score, flags). Handles null KPIs with weight redistribution."""
    if otd is None and fr is None and qr is None:
        return None, ["all_kpis_null:score_unavailable"]

    flags = []
    if otd is None:
        remaining = w_fr + w_qr
        if remaining == 0:
            return None, ["otd_null:zero_remaining_weights"]
        score = (fr * (w_fr / remaining)) + ((100 - qr) * (w_qr / remaining))
        flags.append("otd_null:weights_redistributed")
    elif fr is None:
        remaining = w_otd + w_qr
        if remaining == 0:
            return None, ["fr_null:zero_remaining_weights"]
        score = (otd * (w_otd / remaining)) + ((100 - qr) * (w_qr / remaining))
        flags.append("fr_null:weights_redistributed")
    elif qr is None:
        remaining = w_otd + w_fr
        if remaining == 0:
            return None, ["qr_null:zero_remaining_weights"]
        score = (otd * (w_otd / remaining)) + (fr * (w_fr / remaining))
        flags.append("qr_null:weights_redistributed")
    else:
        score = (otd * w_otd) + (fr * w_fr) + ((100 - qr) * w_qr)

    return round(max(0.0, min(100.0, score)), 2), flags


def _get_rating(score):
    if score is None:
        return None, "Unrated"
    if score >= 95:
        return "A", "Strategic Partner"
    if score >= 85:
        return "B", "Reliable"
    if score >= 70:
        return "C", "Needs Intervention"
    return "D", "Critical Risk"


def _linear_slope(y: list) -> float:
    n = len(y)
    x = list(range(1, n + 1))
    sx, sy = sum(x), sum(y)
    sxy = sum(x[i] * y[i] for i in range(n))
    sx2 = sum(xi ** 2 for xi in x)
    denom = n * sx2 - sx ** 2
    if denom == 0:
        return 0.0
    return (n * sxy - sx * sy) / denom


def _std_dev(scores: list) -> float:
    n = len(scores)
    mean = sum(scores) / n
    return math.sqrt(sum((s - mean) ** 2 for s in scores) / n)


def _calc_risk(rating, t30, sdf, wow):
    reasons = []
    if rating is None:
        return "Unknown", ["null_score"]

    if rating == "D" or sdf or (rating == "C" and t30 == "Declining"):
        level = "Critical"
        if rating == "D":
            reasons.append("rating_D")
        if sdf:
            reasons.append("silent_drop_detected")
        if rating == "C" and t30 == "Declining":
            reasons.append("C_rating_declining")
    elif (rating == "C" or
          (rating == "B" and sdf) or
          (rating == "B" and t30 == "Declining" and wow is not None and wow < -3)):
        level = "High"
        if rating == "C":
            reasons.append("rating_C")
        if rating == "B" and sdf:
            reasons.append("B_with_silent_drop")
        if rating == "B" and t30 == "Declining" and wow is not None and wow < -3:
            reasons.append("B_declining_with_wow")
    elif (rating == "B" and t30 not in ("Improving",)) or t30 == "Erratic":
        level = "Medium"
        if rating == "B" and t30 != "Improving":
            reasons.append("B_not_improving")
        if t30 == "Erratic":
            reasons.append("erratic_trend")
    elif rating == "A" or (rating == "B" and t30 in ("Improving", "Stable")):
        level = "Low"
        if rating == "A":
            reasons.append("rating_A")
        if rating == "B":
            reasons.append("B_stable_or_improving")
    else:
        level = "Unknown"
        reasons.append("insufficient_history")

    return level, reasons


# ── Main entry point ──────────────────────────────────────────────────────────

def run(new_weights: dict, old_weights: dict, historical_data: list) -> dict:
    weights, norm_flags = _normalize_weights(new_weights)
    w_otd = weights["weight_otd"]
    w_fr  = weights["weight_fr"]
    w_qr  = weights["weight_qr"]

    # ── Step 1 + 2: Recalculate score and rating per record ───────────────────
    processed = []
    records_by_supplier: dict[str, list] = {}

    for rec in historical_data:
        otd = rec.get("otd_pct")
        fr  = rec.get("fr_pct")
        qr  = rec.get("qr_pct")
        old_score  = rec.get("old_composite_score")
        old_rating = rec.get("old_rating")

        new_score, score_flags = _calc_score(otd, fr, qr, w_otd, w_fr, w_qr)
        new_rating, rating_label = _get_rating(new_score)

        score_delta = (
            round(new_score - old_score, 2)
            if new_score is not None and old_score is not None
            else None
        )
        rating_changed = new_rating != old_rating

        row = {
            "record_id":      rec["record_id"],
            "supplier_id":    rec["supplier_id"],
            "supplier_name":  rec["supplier_name"],
            "category":       rec["category"],
            "week_start_date": rec["week_start_date"],
            "kpis": {"otd_pct": otd, "fr_pct": fr, "qr_pct": qr},
            "score": {
                "old_composite_score": old_score,
                "new_composite_score": new_score,
                "score_delta":         score_delta,
                "old_rating":          old_rating,
                "new_rating":          new_rating,
                "rating_changed":      rating_changed,
                "rating_label":        rating_label,
            },
            "weights_snapshot": {
                "weight_otd": round(w_otd, 6),
                "weight_fr":  round(w_fr,  6),
                "weight_qr":  round(w_qr,  6),
            },
            "trend": {
                "wow_change":           None,
                "wow_direction":        None,
                "trend_30d":            None,
                "silent_drop_flag":     False,
                "silent_drop_magnitude": None,
            },
            "forecast": {
                "forecast_score":  None,
                "forecast_rating": None,
                "confidence":      None,
            },
            "risk": {"risk_level": "Unknown", "risk_reasons": []},
            "_flags": norm_flags + score_flags + (["rating_changed"] if rating_changed else []),
        }
        processed.append(row)
        records_by_supplier.setdefault(rec["supplier_id"], []).append(row)

    # ── Step 3: Trend algorithms per supplier ─────────────────────────────────
    for recs in records_by_supplier.values():
        recs.sort(key=lambda r: r["week_start_date"])
        scores = []

        for i, rec in enumerate(recs):
            score = rec["score"]["new_composite_score"]
            scores.append(score)

            # WoW
            if i == 0 or score is None or scores[i - 1] is None:
                pass  # leave wow_change = None
            else:
                diff = round(score - scores[i - 1], 2)
                rec["trend"]["wow_change"] = diff
                rec["trend"]["wow_direction"] = (
                    "Improving" if diff >= 5 else "Declining" if diff <= -5 else "Stable"
                )

            # 30-day trend + silent drop (4-week window)
            if i >= 3:
                window = [scores[j] for j in range(i - 3, i + 1)]
                valid = [s for s in window if s is not None]
                if len(valid) == 4:
                    slope = _linear_slope(valid)
                    std   = _std_dev(valid)
                    if std > 8.0:
                        rec["trend"]["trend_30d"] = "Erratic"
                    elif slope > 1.0:
                        rec["trend"]["trend_30d"] = "Improving"
                    elif slope < -1.0:
                        rec["trend"]["trend_30d"] = "Declining"
                    else:
                        rec["trend"]["trend_30d"] = "Stable"

                    all_dec = valid[0] > valid[1] > valid[2] > valid[3]
                    drop    = valid[0] - valid[3]
                    if all_dec and drop >= 8:
                        rec["trend"]["silent_drop_flag"]      = True
                        rec["trend"]["silent_drop_magnitude"] = round(drop, 2)
                else:
                    rec["trend"]["trend_30d"] = "Insufficient Data"
            else:
                rec["trend"]["trend_30d"] = "Insufficient Data"

            # Forecast (3+ weeks)
            valid_hist = [s for s in scores[: i + 1] if s is not None]
            if len(valid_hist) >= 3:
                changes    = [valid_hist[j + 1] - valid_hist[j] for j in range(len(valid_hist) - 1)]
                avg_change = sum(changes) / len(changes)
                f_score    = round(max(0, min(100, valid_hist[-1] + avg_change)), 2)
                f_rating, _ = _get_rating(f_score)
                n = len(valid_hist)
                confidence = "High" if n >= 6 else "Medium" if n >= 4 else "Low"
                rec["forecast"].update({
                    "forecast_score":  f_score,
                    "forecast_rating": f_rating,
                    "confidence":      confidence,
                })

            # Risk
            risk_level, risk_reasons = _calc_risk(
                rec["score"]["new_rating"],
                rec["trend"]["trend_30d"],
                rec["trend"]["silent_drop_flag"],
                rec["trend"]["wow_change"],
            )
            rec["risk"] = {"risk_level": risk_level, "risk_reasons": risk_reasons}

    # ── Step 4: Impact summary ────────────────────────────────────────────────
    rating_changes, score_deltas = [], []
    new_dist = {"A": 0, "B": 0, "C": 0, "D": 0}
    old_dist = {"A": 0, "B": 0, "C": 0, "D": 0}
    improved = declined = unchanged = 0

    for rec in processed:
        delta = rec["score"]["score_delta"]
        if delta is not None:
            score_deltas.append(delta)
            if delta > 0:
                improved  += 1
            elif delta < 0:
                declined  += 1
            else:
                unchanged += 1

        nr = rec["score"]["new_rating"]
        or_ = rec["score"]["old_rating"]
        if nr in new_dist:
            new_dist[nr] += 1
        if or_ in old_dist:
            old_dist[or_] += 1

        if rec["score"]["rating_changed"]:
            rating_changes.append({
                "supplier_id":    rec["supplier_id"],
                "supplier_name":  rec["supplier_name"],
                "week_start_date": rec["week_start_date"],
                "old_rating":     or_,
                "new_rating":     nr,
                "old_score":      rec["score"]["old_composite_score"],
                "new_score":      rec["score"]["new_composite_score"],
                "score_delta":    delta,
            })

    avg_delta    = round(sum(score_deltas) / len(score_deltas), 2) if score_deltas else 0.0
    max_increase = round(max(score_deltas), 2) if score_deltas else 0.0
    max_decrease = round(min(score_deltas), 2) if score_deltas else 0.0

    return {
        "agent":  "weight_recalculation",
        "status": "success" if processed else "failed",
        "weights_applied": {
            "weight_otd": round(w_otd, 6),
            "weight_fr":  round(w_fr,  6),
            "weight_qr":  round(w_qr,  6),
        },
        "impact_summary": {
            "total_records_recalculated": len(processed),
            "total_suppliers_affected":   len(records_by_supplier),
            "total_weeks_affected":       len({r["week_start_date"] for r in processed}),
            "records_rating_changed":     len(rating_changes),
            "records_improved":           improved,
            "records_declined":           declined,
            "records_unchanged":          unchanged,
            "avg_score_delta":            avg_delta,
            "max_score_increase":         max_increase,
            "max_score_decrease":         max_decrease,
            "rating_changes":             rating_changes,
            "new_rating_distribution":    new_dist,
            "old_rating_distribution":    old_dist,
        },
        "recalculated_records": processed,
    }
