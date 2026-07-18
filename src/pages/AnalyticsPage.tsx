import { useMemo } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { KpiCardGrid } from "@/components/cards/KpiCardGrid";
import { ChartsSection } from "@/components/charts/ChartsSection";
import { FilterBar } from "@/components/filters/FilterBar";
import { ErrorState } from "@/components/feedback/ErrorState";
import { useCallRecords } from "@/features/calls/hooks/useCallRecords";
import { useCallAnalytics } from "@/features/calls/hooks/useCallAnalytics";
import { useCallFilters } from "@/features/calls/hooks/useCallFilters";
import { filterRecords } from "@/features/calls/selectors/filtering";

export function AnalyticsPage() {
  const { data: records, isPending, isError, error, refetch } = useCallRecords();
  const { filters } = useCallFilters();

  const filteredRecords = useMemo(
    () => filterRecords(records ?? [], filters),
    [records, filters],
  );
  const analytics = useCallAnalytics(filteredRecords);

  if (isError) {
    return (
      <div className="flex flex-col gap-5">
        <PageHeader
          title="Analytics"
          description="Deeper breakdowns with date, city, status, and direction filters."
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
        title="Analytics"
        description="Deeper breakdowns with date, city, status, and direction filters."
      />

      <FilterBar records={records ?? []} />

      <KpiCardGrid metrics={analytics.metrics} isLoading={isPending} />

      <ChartsSection {...analytics} isLoading={isPending} />
    </div>
  );
}
