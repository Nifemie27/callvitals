import type { CallRecord } from "@/features/calls/types";

export interface CallMetrics {
  totalCalls: number;
  totalCost: number;
  averageCost: number;
  averageDuration: number;
  longestCall: CallRecord | null;
  shortestCall: CallRecord | null;
  successfulCalls: number;
  failedCalls: number;
  successRate: number;
  inboundCalls: number;
  outboundCalls: number;
}

export function computeMetrics(records: CallRecord[]): CallMetrics {
  const totalCalls = records.length;

  if (totalCalls === 0) {
    return {
      totalCalls: 0,
      totalCost: 0,
      averageCost: 0,
      averageDuration: 0,
      longestCall: null,
      shortestCall: null,
      successfulCalls: 0,
      failedCalls: 0,
      successRate: 0,
      inboundCalls: 0,
      outboundCalls: 0,
    };
  }

  const totalCost = records.reduce((sum, r) => sum + r.cost, 0);
  const totalDuration = records.reduce((sum, r) => sum + r.durationSeconds, 0);
  const successfulCalls = records.filter((r) => r.isSuccessful).length;
  const inboundCalls = records.filter((r) => r.isInbound).length;

  const longestCall = records.reduce((longest, r) =>
    r.durationSeconds > longest.durationSeconds ? r : longest,
  );
  const shortestCall = records.reduce((shortest, r) =>
    r.durationSeconds < shortest.durationSeconds ? r : shortest,
  );

  return {
    totalCalls,
    totalCost,
    averageCost: totalCost / totalCalls,
    averageDuration: totalDuration / totalCalls,
    longestCall,
    shortestCall,
    successfulCalls,
    failedCalls: totalCalls - successfulCalls,
    successRate: successfulCalls / totalCalls,
    inboundCalls,
    outboundCalls: totalCalls - inboundCalls,
  };
}
