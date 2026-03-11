/**
 * src/lib/normalizers.js
 * Converts backend snake_case API responses → frontend camelCase shape
 * so all existing page logic keeps working unchanged.
 */

export function normalizeWeeklyScore(w) {
  return {
    ...w,
    fillRate:   w.fill_rate   ?? w.fillRate   ?? 0,
    rejectRate: w.reject_rate ?? w.rejectRate ?? 0,
  };
}

export function normalizeSupplier(s) {
  return {
    ...s,
    fillRate:       s.fill_rate       ?? s.fillRate       ?? 0,
    rejectRate:     s.reject_rate     ?? s.rejectRate     ?? 0,
    compositeScore: s.composite_score ?? s.compositeScore ?? 0,
    weeklyScores:   (s.weekly_scores  ?? s.weeklyScores   ?? []).map(normalizeWeeklyScore),
  };
}

export function normalizeSupplierList(list) {
  return (list ?? []).map(normalizeSupplier);
}
