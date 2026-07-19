import { Phone, CircleDollarSign, Clock, CircleCheck, CircleX } from "lucide-react";
import { KpiCard } from "@/components/cards/KpiCard";
import { formatCurrency } from "@/lib/format/currency";
import { formatDuration } from "@/lib/format/duration";
import type { CallMetrics } from "@/features/calls/selectors/metrics";

interface KpiCardGridProps {
  metrics: CallMetrics;
  isLoading: boolean;
}

export function KpiCardGrid({ metrics, isLoading }: KpiCardGridProps) {
  const successPercent = Math.round(metrics.successRate * 100);
  const failedPercent = metrics.totalCalls === 0 ? 0 : 100 - successPercent;

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
      <KpiCard
        icon={Phone}
        label="Total calls"
        value={metrics.totalCalls.toLocaleString()}
        subtitle={
          metrics.longestCall
            ? `Range 0s – ${formatDuration(metrics.longestCall.durationSeconds)}`
            : undefined
        }
        isLoading={isLoading}
      />
      <KpiCard
        icon={CircleDollarSign}
        label="Total cost"
        value={formatCurrency(metrics.totalCost)}
        subtitle={`${formatCurrency(metrics.averageCost)} average per call`}
        isLoading={isLoading}
      />
      <KpiCard
        icon={Clock}
        label="Avg. duration"
        value={formatDuration(metrics.averageDuration)}
        subtitle={
          metrics.longestCall && metrics.shortestCall
            ? `${formatDuration(metrics.shortestCall.durationSeconds)} – ${formatDuration(metrics.longestCall.durationSeconds)}`
            : undefined
        }
        isLoading={isLoading}
      />
      <KpiCard
        icon={CircleCheck}
        label="Successful calls"
        value={metrics.successfulCalls.toLocaleString()}
        subtitle={`${successPercent}% success rate`}
        tone={metrics.successfulCalls === 0 ? "critical" : "default"}
        isLoading={isLoading}
      />
      <KpiCard
        icon={CircleX}
        label="Failed calls"
        value={metrics.failedCalls.toLocaleString()}
        subtitle={`${failedPercent}% of total calls`}
        tone={
          metrics.failedCalls === metrics.totalCalls && metrics.totalCalls > 0
            ? "critical"
            : "default"
        }
        isLoading={isLoading}
      />
    </div>
  );
}
