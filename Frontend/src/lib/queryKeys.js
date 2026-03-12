// Centralized React Query key factory
// Import this wherever you need query keys or cache invalidation.

export const queryKeys = {
  // All supplier queries — invalidate with queryKeys.suppliers.all()
  suppliers: {
    all:    ()         => ["suppliers"],
    list:   (filters)  => ["suppliers", "list", filters],
    detail: (id)       => ["suppliers", "detail", id],
  },
  // Metrics queries
  metrics: {
    all:     ()             => ["metrics"],
    summary: ()             => ["metrics", "summary"],
    trend:   (category, grade) => ["metrics", "trend", category, grade],
  },
};
