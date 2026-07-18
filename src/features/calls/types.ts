/** Shape of a single record as returned by the CDR API, before mapping. */
export interface RawCallRecordDTO {
  id: string;
  callerName: string;
  callerNumber: string;
  receiverNumber: string;
  city: string;
  callDirection: boolean;
  callStatus: boolean;
  callDuration: number;
  callCost: string;
  callStartTime: string;
  callEndTime: string;
}

/**
 * Domain model used everywhere past the mapper. `callDuration` is the only
 * source of truth for duration — `callEndTime - callStartTime` does not
 * agree with it in the CDR sample and must not be used for metrics.
 */
export interface CallRecord {
  id: string;
  callerName: string;
  callerNumber: string;
  receiverNumber: string;
  city: string;
  isInbound: boolean;
  isSuccessful: boolean;
  durationSeconds: number;
  cost: number;
  startTime: Date;
  endTime: Date;
}
