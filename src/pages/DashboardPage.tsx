import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { useCallRecords } from "@/features/calls/hooks/useCallRecords";
import { useCallAnalytics } from "@/features/calls/hooks/useCallAnalytics";
import { formatCurrency } from "@/lib/format/currency";
import { formatDuration } from "@/lib/format/duration";

export function DashboardPage() {
  const { data: records, isPending, isError, error } = useCallRecords();
  const { metrics, topCities, topCostCities, hourly } =
    useCallAnalytics(records);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Dashboard"
        description="Overview of call activity, cost, and success across the CDR sample."
      />

      {isPending && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Loading call records…
          </CardContent>
        </Card>
      )}

      {isError && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed to load call records."}
          </CardContent>
        </Card>
      )}

      {records && (
        <Card>
          <CardContent className="grid grid-cols-2 gap-x-8 gap-y-2 py-6 text-sm sm:grid-cols-3">
            <div>
              <div className="text-muted-foreground">Total calls</div>
              <div className="font-medium">{metrics.totalCalls}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Total cost</div>
              <div className="font-medium">
                {formatCurrency(metrics.totalCost)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Average duration</div>
              <div className="font-medium">
                {formatDuration(metrics.averageDuration)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Success rate</div>
              <div className="font-medium">
                {Math.round(metrics.successRate * 100)}% ({metrics.successfulCalls} of{" "}
                {metrics.totalCalls})
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Direction split</div>
              <div className="font-medium">
                {metrics.inboundCalls} in / {metrics.outboundCalls} out
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Longest / shortest</div>
              <div className="font-medium">
                {metrics.longestCall && formatDuration(metrics.longestCall.durationSeconds)} /{" "}
                {metrics.shortestCall && formatDuration(metrics.shortestCall.durationSeconds)}
              </div>
            </div>
            <div className="col-span-2 sm:col-span-3">
              <div className="text-muted-foreground">Top cost cities</div>
              <div className="font-medium">
                {topCostCities
                  .slice(0, 3)
                  .map((c) => `${c.city} (${formatCurrency(c.totalCost)})`)
                  .join(", ")}
              </div>
            </div>
            <div className="col-span-2 sm:col-span-3">
              <div className="text-muted-foreground">
                Calls by city (top {topCities.top.length} + other)
              </div>
              <div className="font-medium">
                {topCities.top.map((c) => `${c.city}: ${c.calls}`).join(", ")}
                {topCities.otherCityCount > 0 &&
                  `, Other (${topCities.otherCityCount} cities): ${topCities.otherCalls}`}
              </div>
            </div>
            <div className="col-span-2 sm:col-span-3">
              <div className="text-muted-foreground">Busiest hour (UTC)</div>
              <div className="font-medium">
                {hourly.reduce((busiest, h) => (h.calls > busiest.calls ? h : busiest)).hour}
                :00 — {hourly.reduce((busiest, h) => (h.calls > busiest.calls ? h : busiest)).calls}{" "}
                calls
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
