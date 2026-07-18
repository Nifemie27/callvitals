import { PageHeader } from "@/components/layout/PageHeader";
import { KpiCardGrid } from "@/components/cards/KpiCardGrid";
import { DataQualityNotice } from "@/components/cards/DataQualityNotice";
import { ChartCard } from "@/components/charts/ChartCard";
import { ActivityTimelineChart } from "@/components/charts/ActivityTimelineChart";
import { DurationBarChart } from "@/components/charts/DurationBarChart";
import { CostByCityChart } from "@/components/charts/CostByCityChart";
import { CallsByCityChart } from "@/components/charts/CallsByCityChart";
import { CallLogsTable } from "@/components/table/CallLogsTable";
import { ErrorState } from "@/components/feedback/ErrorState";
import { useCallRecords } from "@/features/calls/hooks/useCallRecords";
import { useCallAnalytics } from "@/features/calls/hooks/useCallAnalytics";
import { formatDuration } from "@/lib/format/duration";

export function DashboardPage() {
  const { data: records, isPending, isError, error, refetch } = useCallRecords();
  const { metrics, hourly, durationBuckets, topCostCities, topCities } =
    useCallAnalytics(records);

  if (isError) {
    return (
      <div className="flex flex-col gap-5">
        <PageHeader
          title="Dashboard"
          description="Overview of call activity, cost, and success across the CDR sample."
        />
        <ErrorState
          message={
            error instanceof Error
              ? error.message
              : "Failed to load call records from the CDR API."
          }
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Dashboard"
        description="Overview of call activity, cost, and success across the CDR sample."
      />

      <KpiCardGrid metrics={metrics} isLoading={isPending} />

      {!isPending && <DataQualityNotice metrics={metrics} />}

      <ChartCard
        title="Call activity by hour"
        meta="Aggregated across every day in the sample · UTC"
        isLoading={isPending}
        isEmpty={!isPending && metrics.totalCalls === 0}
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
          isLoading={isPending}
          isEmpty={!isPending && metrics.totalCalls === 0}
        >
          <DurationBarChart data={durationBuckets} />
        </ChartCard>

        <ChartCard
          title="Highest-cost calls by city"
          meta={`Top ${topCostCities.length} cities`}
          isLoading={isPending}
          isEmpty={!isPending && topCostCities.length === 0}
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
        isLoading={isPending}
        isEmpty={!isPending && metrics.totalCalls === 0}
        footnote={
          topCities.otherCityCount > 0 &&
          "No city repeats more than a handful of times in this sample — the long tail is shown honestly rather than hidden behind a misleadingly “even” top-N chart."
        }
      >
        <CallsByCityChart grouping={topCities} />
      </ChartCard>

      <CallLogsTable records={records ?? []} isLoading={isPending} />
    </div>
  );
}
