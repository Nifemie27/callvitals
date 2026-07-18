import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Dashboard"
        description="Overview of call activity, cost, and success across the CDR sample."
      />
      <Card>
        <CardContent className="flex flex-col items-center gap-1.5 py-10 text-center">
          <p className="text-sm text-foreground">
            This page will show 5 KPI cards, 4 charts, and the recent call
            log table for all 100 records in the CDR sample.
          </p>
          <p className="text-sm text-muted-foreground">
            Next up: the API service, the DTO→domain mapper, and the
            analytics selectors that compute every metric on this page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
