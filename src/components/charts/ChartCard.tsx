import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { ChartSkeleton } from "@/components/charts/ChartSkeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  meta?: string;
  footnote?: ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  children: ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  meta,
  footnote,
  isLoading,
  isEmpty,
  emptyMessage = "No calls match the current data.",
  children,
  className,
}: ChartCardProps) {
  return (
    <Card className={cn("gap-1 px-4.5 pt-4 pb-3", className)}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <h3 className="text-[13.5px] font-semibold">{title}</h3>
        {meta && (
          <span className="shrink-0 text-[11.5px] text-muted-foreground">
            {meta}
          </span>
        )}
      </div>

      {isLoading ? (
        <ChartSkeleton />
      ) : isEmpty ? (
        <EmptyState message={emptyMessage} />
      ) : (
        children
      )}

      {footnote && !isLoading && !isEmpty && (
        <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted-foreground">
          {footnote}
        </p>
      )}
    </Card>
  );
}
