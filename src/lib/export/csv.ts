import type { CallRecord } from "@/features/calls/types";

const HEADER = [
  "Caller Name",
  "Caller Number",
  "Receiver Number",
  "City",
  "Duration (s)",
  "Cost",
  "Direction",
  "Status",
  "Start Time (UTC)",
];

function escapeCsvField(field: string): string {
  return /[",\n]/.test(field) ? `"${field.replace(/"/g, '""')}"` : field;
}

function toRow(record: CallRecord): string[] {
  return [
    record.callerName,
    record.callerNumber,
    record.receiverNumber,
    record.city,
    String(record.durationSeconds),
    record.cost.toFixed(2),
    record.isInbound ? "Inbound" : "Outbound",
    record.isSuccessful ? "Successful" : "Failed",
    record.startTime.toISOString(),
  ];
}

export function exportCallRecordsToCsv(
  records: CallRecord[],
  filename = "call-logs.csv",
) {
  const csv = [HEADER, ...records.map(toRow)]
    .map((row) => row.map(escapeCsvField).join(","))
    .join("\r\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
