import { Download, Printer } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { CallLogsTable } from "@/components/table/CallLogsTable";
import { ErrorState } from "@/components/feedback/ErrorState";
import { useCallRecords } from "@/features/calls/hooks/useCallRecords";
import { exportCallRecordsToCsv } from "@/lib/export/csv";

export function ReportsPage() {
  const { data: records, isPending, isError, error, refetch } = useCallRecords();

  if (isError) {
    return (
      <div className="flex flex-col gap-5">
        <PageHeader
          title="Reports"
          description="Full call log explorer with CSV and PDF export."
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
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title="Reports"
          description="Every call record in the CDR sample — export for offline analysis."
        />
        <div className="flex gap-2 print:hidden">
          <Button
            size="sm"
            variant="outline"
            disabled={!records?.length}
            onClick={() => records && exportCallRecordsToCsv(records)}
          >
            <Download />
            Export CSV
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={!records?.length}
            onClick={() => window.print()}
          >
            <Printer />
            Export PDF
          </Button>
        </div>
      </div>

      <CallLogsTable
        records={records ?? []}
        isLoading={isPending}
        pageSize={records?.length || 1}
      />
    </div>
  );
}
