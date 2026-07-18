import { apiClient } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { RawCallRecordDTO } from "@/features/calls/types";

export async function getCallRecords(): Promise<RawCallRecordDTO[]> {
  const { data } = await apiClient.get<RawCallRecordDTO[]>(ENDPOINTS.cdr);
  return data;
}
