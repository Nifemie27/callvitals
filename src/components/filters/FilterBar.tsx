import { useMemo } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { callsByDay } from "@/features/calls/selectors/grouping";
import type { CallFilters } from "@/features/calls/selectors/filtering";
import type { CallRecord } from "@/features/calls/types";
import { useCallFilters } from "@/features/calls/hooks/useCallFilters";

interface SegmentedOption {
  value: string;
  label: string;
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="inline-flex gap-1 rounded-lg border bg-secondary p-1">
      {options.map((option) => (
        <Button
          key={option.value}
          type="button"
          size="sm"
          variant="ghost"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "h-7 px-2.5 text-xs text-muted-foreground",
            value === option.value && "bg-card text-foreground shadow-sm",
          )}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

function formatDayLabel(day: string): string {
  return new Date(`${day}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

interface FilterBarProps {
  records: CallRecord[];
}

export function FilterBar({ records }: FilterBarProps) {
  const { filters, setFilter, reset, hasActiveFilters } = useCallFilters();

  const dayOptions = useMemo(() => {
    const days = callsByDay(records);
    return [
      { value: "all", label: "All days" },
      ...days.map((d) => ({ value: d.date, label: formatDayLabel(d.date) })),
    ];
  }, [records]);

  const cityOptions = useMemo(
    () => [...new Set(records.map((r) => r.city))].sort(),
    [records],
  );

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Segmented
        options={dayOptions}
        value={filters.day ?? "all"}
        onChange={(value) => setFilter("day", value)}
      />

      <Select
        value={filters.city ?? "all"}
        onValueChange={(value) => setFilter("city", value)}
      >
        <SelectTrigger size="sm" className="w-40 text-xs" aria-label="Filter by city">
          <SelectValue placeholder="All cities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All cities</SelectItem>
          {cityOptions.map((city) => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Segmented
        options={[
          { value: "all", label: "All statuses" },
          { value: "successful", label: "Successful" },
          { value: "failed", label: "Failed" },
        ]}
        value={filters.status}
        onChange={(value) => setFilter("status", value as CallFilters["status"])}
      />

      <Segmented
        options={[
          { value: "all", label: "All directions" },
          { value: "inbound", label: "Inbound" },
          { value: "outbound", label: "Outbound" },
        ]}
        value={filters.direction}
        onChange={(value) =>
          setFilter("direction", value as CallFilters["direction"])
        }
      />

      {hasActiveFilters && (
        <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs" onClick={reset}>
          <X className="size-3.5" />
          Reset filters
        </Button>
      )}
    </div>
  );
}
