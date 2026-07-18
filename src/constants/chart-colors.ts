/**
 * Every chart in this dashboard is a single-series magnitude/trend chart, so
 * they all share one accent (the sequential blue also used for interactive
 * UI). "Other" buckets (long-tail groupings) get a separate muted tone so
 * they read as an aggregate, not a ranked entity.
 */
export const CHART_SERIES_COLOR = "var(--chart-1)";
export const CHART_OTHER_COLOR = "var(--chart-5)";
