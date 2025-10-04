import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { ListTimeSlotsResponse } from "../../types/response";
import { TimeSlotApi } from "../../apis/timeSlotApi";

type Options = Omit<
  UseQueryOptions<ListTimeSlotsResponse, Error, ListTimeSlotsResponse, QueryKey>,
  "queryKey" | "queryFn"
>;

export function useGetTimeSlotsByDoctorIdAndDateRangeQuery(
  doctorId: string,
  startDate: string,
  endDate: string,
  options?: Options,
) {
  return useQuery({
    queryKey: [QueryKeyEnum.TimeSlot, "doctor", doctorId, "dateRange", startDate, endDate],
    queryFn: () => TimeSlotApi.getByDoctorIdAndDateRange(doctorId, startDate, endDate),
    enabled: !!doctorId && !!startDate && !!endDate,
    ...options,
  });
}
