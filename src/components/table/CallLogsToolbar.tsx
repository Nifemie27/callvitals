import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CallLogsToolbarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
}

export function CallLogsToolbar({
  value,
  onChange,
  resultCount,
}: CallLogsToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-b px-4.5 py-3.5">
      <h3 className="text-[13.5px] font-semibold">Recent call logs</h3>
      <div className="flex items-center gap-3">
        <span className="hidden text-xs text-muted-foreground sm:inline">
          {resultCount} {resultCount === 1 ? "result" : "results"}
        </span>
        <div className="flex items-center gap-2 rounded-lg border bg-secondary px-2.5 py-1.5">
          <Search className="size-3.5 shrink-0 text-muted-foreground" />
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search caller, number, city…"
            aria-label="Search call logs"
            className="h-auto w-44 border-0 bg-transparent p-0 text-[13px] shadow-none focus-visible:ring-0 sm:w-56"
          />
        </div>
      </div>
    </div>
  );
}
