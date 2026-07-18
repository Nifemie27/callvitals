import { PageHeader } from "@/components/layout/PageHeader";
import { KpiCardGrid } from "@/components/cards/KpiCardGrid";
import { DataQualityNotice } from "@/components/cards/DataQualityNotice";
import { ChartsSection } from "@/components/charts/ChartsSection";
import { CallLogsTable } from "@/components/table/CallLogsTable";
import { ErrorState } from "@/components/feedback/ErrorState";
import { useCallRecords } from "@/features/calls/hooks/useCallRecords";
import { useCallAnalytics } from "@/features/calls/hooks/useCallAnalytics";

export function DashboardPage() {
  const { data: records, isPending, isError, error, refetch } = useCallRecords();
  const analytics = useCallAnalytics(records);

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

      <KpiCardGrid metrics={analytics.metrics} isLoading={isPending} />

      {!isPending && <DataQualityNotice metrics={analytics.metrics} />}

      <ChartsSection {...analytics} isLoading={isPending} />

      <CallLogsTable records={records ?? []} isLoading={isPending} />
    </div>
  );
}
