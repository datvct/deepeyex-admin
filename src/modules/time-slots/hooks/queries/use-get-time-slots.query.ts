import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { ListTimeSlotsResponse } from "../../types/response";
import { TimeSlotApi } from "../../apis/timeSlotApi";

type Options = Omit<
  UseQueryOptions<ListTimeSlotsResponse, Error, ListTimeSlotsResponse, QueryKey>,
  "queryKey" | "queryFn"
>;

export function useListTimeSlotsQuery(options?: Options) {
  return useQuery({
    queryKey: [QueryKeyEnum.TimeSlot],
    queryFn: () => TimeSlotApi.listAll(),
    ...options,
  });
}
