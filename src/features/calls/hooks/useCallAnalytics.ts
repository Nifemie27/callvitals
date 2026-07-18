import { useMemo } from "react";
import type { CallRecord } from "@/features/calls/types";
import { computeMetrics } from "@/features/calls/selectors/metrics";
import {
  callsByCity,
  callsByDay,
  callsByHour,
  costByCity,
} from "@/features/calls/selectors/grouping";
import { durationDistribution } from "@/features/calls/selectors/distribution";

export function useCallAnalytics(records: CallRecord[] | undefined) {
  return useMemo(() => {
    const safeRecords = records ?? [];
    return {
      metrics: computeMetrics(safeRecords),
      hourly: callsByHour(safeRecords),
      daily: callsByDay(safeRecords),
      topCities: callsByCity(safeRecords, 5),
      topCostCities: costByCity(safeRecords, 8),
      durationBuckets: durationDistribution(safeRecords, 5),
    };
  }, [records]);
}
