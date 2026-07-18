import { useQuery } from "@tanstack/react-query";
import { getCallRecords } from "@/services/api/cdr.service";
import { mapCallRecords } from "@/services/mappers/callRecord.mapper";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useCallRecords() {
  return useQuery({
    queryKey: QUERY_KEYS.cdr,
    queryFn: async () => mapCallRecords(await getCallRecords()),
  });
}
