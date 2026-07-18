import type { CallRecord } from "@/features/calls/types";

export interface HourlyCallVolume {
  hour: number;
  calls: number;
}

export interface DailyCallVolume {
  date: string;
  calls: number;
}

export interface CityCount {
  city: string;
  calls: number;
}

export interface CityCost {
  city: string;
  totalCost: number;
}

/** Calls per hour of day (0–23), aggregated across every day in the set, in UTC. */
export function callsByHour(records: CallRecord[]): HourlyCallVolume[] {
  const counts = new Array<number>(24).fill(0);
  for (const record of records) {
    counts[record.startTime.getUTCHours()] += 1;
  }
  return counts.map((calls, hour) => ({ hour, calls }));
}

/** Calls per calendar day (UTC), sorted chronologically. */
export function callsByDay(records: CallRecord[]): DailyCallVolume[] {
  const counts = new Map<string, number>();
  for (const record of records) {
    const date = record.startTime.toISOString().slice(0, 10);
    counts.set(date, (counts.get(date) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([date, calls]) => ({ date, calls }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Top N cities by call volume, with the remainder folded into "Other".
 * Every city in the CDR sample has exactly one call, so this reads as a
 * long tail by design, not a rendering issue — see the "Other" caption
 * wherever this feeds a chart.
 */
export function callsByCity(
  records: CallRecord[],
  topN = 5,
): { top: CityCount[]; otherCalls: number; otherCityCount: number } {
  const counts = new Map<string, number>();
  for (const record of records) {
    counts.set(record.city, (counts.get(record.city) ?? 0) + 1);
  }
  const sorted = [...counts.entries()]
    .map(([city, calls]) => ({ city, calls }))
    .sort((a, b) => b.calls - a.calls);

  const top = sorted.slice(0, topN);
  const rest = sorted.slice(topN);
  const otherCalls = rest.reduce((sum, r) => sum + r.calls, 0);

  return { top, otherCalls, otherCityCount: rest.length };
}

/** Top N cities by total call cost. */
export function costByCity(records: CallRecord[], topN = 8): CityCost[] {
  const totals = new Map<string, number>();
  for (const record of records) {
    totals.set(record.city, (totals.get(record.city) ?? 0) + record.cost);
  }
  return [...totals.entries()]
    .map(([city, totalCost]) => ({ city, totalCost }))
    .sort((a, b) => b.totalCost - a.totalCost)
    .slice(0, topN);
}
