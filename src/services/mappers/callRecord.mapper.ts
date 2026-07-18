import type { CallRecord, RawCallRecordDTO } from "@/features/calls/types";

function parseCost(raw: string): number {
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : 0;
}

export function mapCallRecord(dto: RawCallRecordDTO): CallRecord {
  return {
    id: dto.id,
    callerName: dto.callerName,
    callerNumber: dto.callerNumber,
    receiverNumber: dto.receiverNumber,
    city: dto.city,
    isInbound: dto.callDirection === true,
    isSuccessful: dto.callStatus === true,
    durationSeconds: dto.callDuration,
    cost: parseCost(dto.callCost),
    startTime: new Date(dto.callStartTime),
    endTime: new Date(dto.callEndTime),
  };
}

export function mapCallRecords(dtos: RawCallRecordDTO[]): CallRecord[] {
  return dtos.map(mapCallRecord);
}
