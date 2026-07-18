import { format } from "date-fns";

export function formatDateTime(date: Date): string {
  return format(date, "MMM d, h:mm a");
}

/** Zero-padded UTC hour label for chart axes, e.g. 0 -> "00". */
export function formatHourLabel(hour: number): string {
  return hour.toString().padStart(2, "0");
}
