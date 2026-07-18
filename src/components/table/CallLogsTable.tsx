import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { CallLogsToolbar } from "@/components/table/CallLogsToolbar";
import { CallStatusBadge } from "@/components/table/CallStatusBadge";
import { CallDirectionBadge } from "@/components/table/CallDirectionBadge";
import { TablePagination } from "@/components/table/TablePagination";
import { EmptyState } from "@/components/feedback/EmptyState";
import { formatCurrency } from "@/lib/format/currency";
import { formatDuration } from "@/lib/format/duration";
import { formatDateTime } from "@/lib/format/date";
import { formatPhoneNumber } from "@/lib/format/phone";
import { cn } from "@/lib/utils";
import type { CallRecord } from "@/features/calls/types";

const PAGE_SIZE = 8;

type SortKey = "duration" | "cost" | "startTime";
type SortDirection = "asc" | "desc";

const SORT_ACCESSORS: Record<SortKey, (r: CallRecord) => number> = {
  duration: (r) => r.durationSeconds,
  cost: (r) => r.cost,
  startTime: (r) => r.startTime.getTime(),
};

interface SortHeaderProps {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  direction: SortDirection;
  onSort: (key: SortKey) => void;
  className?: string;
}

function SortHeader({
  label,
  sortKey,
  activeKey,
  direction,
  onSort,
  className,
}: SortHeaderProps) {
  const isActive = activeKey === sortKey;
  const Icon = isActive ? (direction === "asc" ? ArrowUp : ArrowDown) : ChevronsUpDown;

  return (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide",
          isActive ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {label}
        <Icon className="size-3" strokeWidth={2} />
      </button>
    </TableHead>
  );
}

interface CallLogsTableProps {
  records: CallRecord[];
  isLoading?: boolean;
}

export function CallLogsTable({ records, isLoading }: CallLogsTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("startTime");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return records;
    return records.filter((r) =>
      [r.callerName, r.callerNumber, r.receiverNumber, r.city].some((field) =>
        field.toLowerCase().includes(query),
      ),
    );
  }, [records, search]);

  const sorted = useMemo(() => {
    const accessor = SORT_ACCESSORS[sortKey];
    const direction = sortDirection === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => (accessor(a) - accessor(b)) * direction);
  }, [filtered, sortKey, sortDirection]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paginated = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
    setPage(1);
  }

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  return (
    <Card className="gap-0 overflow-hidden p-0">
      <CallLogsToolbar
        value={search}
        onChange={handleSearch}
        resultCount={sorted.length}
      />

      <div>
        <Table className="min-w-[860px]">
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Caller
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Receiver
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                City
              </TableHead>
              <SortHeader
                label="Duration"
                sortKey="duration"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortHeader
                label="Cost"
                sortKey="cost"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
              <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Direction
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Status
              </TableHead>
              <SortHeader
                label="Start time"
                sortKey="startTime"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: PAGE_SIZE }, (_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }, (_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full max-w-24" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!isLoading &&
              paginated.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="font-medium">{record.callerName}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatPhoneNumber(record.callerNumber)}
                    </div>
                  </TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {formatPhoneNumber(record.receiverNumber)}
                  </TableCell>
                  <TableCell>{record.city}</TableCell>
                  <TableCell className="tabular-nums">
                    {formatDuration(record.durationSeconds)}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {formatCurrency(record.cost)}
                  </TableCell>
                  <TableCell>
                    <CallDirectionBadge isInbound={record.isInbound} />
                  </TableCell>
                  <TableCell>
                    <CallStatusBadge isSuccessful={record.isSuccessful} />
                  </TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {formatDateTime(record.startTime)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {!isLoading && sorted.length === 0 && (
        <EmptyState message="No calls match your search." />
      )}

      {!isLoading && sorted.length > 0 && (
        <TablePagination
          page={currentPage}
          pageCount={pageCount}
          pageSize={PAGE_SIZE}
          totalItems={sorted.length}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(pageCount, p + 1))}
        />
      )}
    </Card>
  );
}
