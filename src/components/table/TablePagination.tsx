import { Button } from "@/components/ui/button";

interface TablePaginationProps {
  page: number;
  pageCount: number;
  pageSize: number;
  totalItems: number;
  onPrev: () => void;
  onNext: () => void;
}

export function TablePagination({
  page,
  pageCount,
  pageSize,
  totalItems,
  onPrev,
  onNext,
}: TablePaginationProps) {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between border-t px-4.5 py-3 text-xs text-muted-foreground">
      <span>
        Showing {start}–{end} of {totalItems}
      </span>
      <div className="flex gap-1.5">
        <Button
          size="sm"
          variant="outline"
          disabled={page <= 1}
          onClick={onPrev}
        >
          Previous
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={page >= pageCount}
          onClick={onNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
