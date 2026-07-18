import type { CallRecord } from "@/features/calls/types";

export type StatusFilter = "all" | "successful" | "failed";
export type DirectionFilter = "all" | "inbound" | "outbound";

export interface CallFilters {
  day: string | null;
  city: string | null;
  status: StatusFilter;
  direction: DirectionFilter;
}

export const DEFAULT_FILTERS: CallFilters = {
  day: null,
  city: null,
  status: "all",
  direction: "all",
};

export function filterRecords(
  records: CallRecord[],
  filters: CallFilters,
): CallRecord[] {
  return records.filter((record) => {
    if (
      filters.day &&
      record.startTime.toISOString().slice(0, 10) !== filters.day
    ) {
      return false;
    }
    if (filters.city && record.city !== filters.city) return false;
    if (filters.status === "successful" && !record.isSuccessful) return false;
    if (filters.status === "failed" && record.isSuccessful) return false;
    if (filters.direction === "inbound" && !record.isInbound) return false;
    if (filters.direction === "outbound" && record.isInbound) return false;
    return true;
  });
}
