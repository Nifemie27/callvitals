import { ChartCard } from "@/components/charts/ChartCard";
import { ActivityTimelineChart } from "@/components/charts/ActivityTimelineChart";
import { DurationBarChart } from "@/components/charts/DurationBarChart";
import { CostByCityChart } from "@/components/charts/CostByCityChart";
import { CallsByCityChart } from "@/components/charts/CallsByCityChart";
import { formatDuration } from "@/lib/format/duration";
import type { CallMetrics } from "@/features/calls/selectors/metrics";
import type {
  HourlyCallVolume,
  CityCost,
  callsByCity,
} from "@/features/calls/selectors/grouping";
import type { DurationBucket } from "@/features/calls/selectors/distribution";

interface ChartsSectionProps {
  metrics: CallMetrics;
  hourly: HourlyCallVolume[];
  durationBuckets: DurationBucket[];
  topCostCities: CityCost[];
  topCities: ReturnType<typeof callsByCity>;
  isLoading: boolean;
}

export function ChartsSection({
  metrics,
  hourly,
  durationBuckets,
  topCostCities,
  topCities,
  isLoading,
}: ChartsSectionProps) {
  const isEmpty = !isLoading && metrics.totalCalls === 0;

  return (
    <div className="flex flex-col gap-3.5">
      <ChartCard
        title="Call activity by hour"
        meta="Aggregated across every day in the sample · UTC"
        isLoading={isLoading}
        isEmpty={isEmpty}
      >
        <ActivityTimelineChart data={hourly} />
      </ChartCard>

      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
        <ChartCard
          title="Call duration distribution"
          meta={
            metrics.longestCall && metrics.shortestCall
              ? `Longest ${formatDuration(metrics.longestCall.durationSeconds)} · shortest ${formatDuration(metrics.shortestCall.durationSeconds)}`
              : undefined
          }
          isLoading={isLoading}
          isEmpty={isEmpty}
        >
          <DurationBarChart data={durationBuckets} />
        </ChartCard>

        <ChartCard
          title="Highest-cost calls by city"
          meta={`Top ${topCostCities.length} cities`}
          isLoading={isLoading}
          isEmpty={!isLoading && topCostCities.length === 0}
        >
          <CostByCityChart data={topCostCities} />
        </ChartCard>
      </div>

      <ChartCard
        title="Calls by city"
        meta={
          topCities.otherCityCount > 0
            ? `${topCities.top.length} named cities · ${topCities.otherCityCount} folded into "Other"`
            : undefined
        }
        isLoading={isLoading}
        isEmpty={isEmpty}
        footnote={
          topCities.otherCityCount > 0 &&
          "No city repeats more than a handful of times in this sample — the long tail is shown honestly rather than hidden behind a misleadingly “even” top-N chart."
        }
      >
        <CallsByCityChart grouping={topCities} />
      </ChartCard>
    </div>
  );
}
