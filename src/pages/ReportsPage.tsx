import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export function ReportsPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Reports"
        description="Full call log explorer with CSV and PDF export."
      />
      <Card>
        <CardContent className="flex flex-col items-center gap-1.5 py-10 text-center">
          <p className="text-sm text-foreground">
            This page is the dashboard's call log table at full height, with
            CSV and PDF export replacing pagination for print-friendly
            reports.
          </p>
          <p className="text-sm text-muted-foreground">
            It's built on the same <code>CallLogsTable</code> component as
            the dashboard — no separate table implementation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
