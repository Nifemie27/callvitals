import type { CallRecord } from "@/features/calls/types";

export interface DurationBucket {
  label: string;
  minSeconds: number;
  maxSeconds: number;
  calls: number;
}

/** Equal-width duration buckets from 0s to the longest call, for a histogram. */
export function durationDistribution(
  records: CallRecord[],
  bucketCount = 5,
): DurationBucket[] {
  if (records.length === 0) return [];

  const maxDuration = Math.max(...records.map((r) => r.durationSeconds));
  const bucketSize = Math.max(1, Math.ceil((maxDuration + 1) / bucketCount));

  const buckets: DurationBucket[] = Array.from(
    { length: bucketCount },
    (_, i) => {
      const minSeconds = i * bucketSize;
      const maxSeconds =
        i === bucketCount - 1 ? maxDuration : minSeconds + bucketSize - 1;
      return {
        label: `${minSeconds}–${maxSeconds}s`,
        minSeconds,
        maxSeconds,
        calls: 0,
      };
    },
  );

  for (const record of records) {
    const index = Math.min(
      bucketCount - 1,
      Math.floor(record.durationSeconds / bucketSize),
    );
    buckets[index].calls += 1;
  }

  return buckets;
}
