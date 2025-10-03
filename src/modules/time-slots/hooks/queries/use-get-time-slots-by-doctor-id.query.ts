import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { ListTimeSlotsResponse } from "../../types/response";
import { TimeSlotApi } from "../../apis/timeSlotApi";

type Options = Omit<
  UseQueryOptions<ListTimeSlotsResponse, Error, ListTimeSlotsResponse, QueryKey>,
  "queryKey" | "queryFn"
>;

export function useGetTimeSlotsByDoctorIdQuery(doctorId: string, options?: Options) {
  return useQuery({
    queryKey: [QueryKeyEnum.TimeSlot, "doctor", doctorId],
    queryFn: () => TimeSlotApi.getByDoctorId(doctorId),
    enabled: !!doctorId,
    ...options,
  });
}
