import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Analytics"
        description="Deeper breakdowns with date-range, city, status, and direction filters."
      />
      <Card>
        <CardContent className="flex flex-col items-center gap-1.5 py-10 text-center">
          <p className="text-sm text-foreground">
            This page reuses the dashboard's charts, scoped by a date range,
            city, call status, and call direction filter.
          </p>
          <p className="text-sm text-muted-foreground">
            It depends on the <code>useCallFilters</code> hook syncing filter
            state to the URL, built alongside the dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
