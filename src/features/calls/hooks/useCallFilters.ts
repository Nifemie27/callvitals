import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type {
  CallFilters,
  DirectionFilter,
  StatusFilter,
} from "@/features/calls/selectors/filtering";

function isStatusFilter(value: string | null): value is StatusFilter {
  return value === "all" || value === "successful" || value === "failed";
}

function isDirectionFilter(value: string | null): value is DirectionFilter {
  return value === "all" || value === "inbound" || value === "outbound";
}

/** Filter state synced to the URL, so a filtered Analytics view is shareable and survives a refresh. */
export function useCallFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: CallFilters = useMemo(
    () => ({
      day: searchParams.get("day"),
      city: searchParams.get("city"),
      status: isStatusFilter(searchParams.get("status"))
        ? (searchParams.get("status") as StatusFilter)
        : "all",
      direction: isDirectionFilter(searchParams.get("direction"))
        ? (searchParams.get("direction") as DirectionFilter)
        : "all",
    }),
    [searchParams],
  );

  const setFilter = useCallback(
    (key: keyof CallFilters, value: string | null) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (!value || value === "all") {
            next.delete(key);
          } else {
            next.set(key, value);
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const reset = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const hasActiveFilters =
    filters.day !== null ||
    filters.city !== null ||
    filters.status !== "all" ||
    filters.direction !== "all";

  return { filters, setFilter, reset, hasActiveFilters };
}
