// src/modules/time-slots/hooks/queries/use-get-available-slots-by-date.query.ts
import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { ListTimeSlotsResponse } from "../../types/response";
import { TimeSlotApi } from "../../apis/timeSlotApi";

type Options = Omit<
  UseQueryOptions<ListTimeSlotsResponse, Error, ListTimeSlotsResponse, QueryKey>,
  "queryKey" | "queryFn"
>;

export interface UseGetAvailableSlotsByDateParams {
  doctorId: string;
  date: string; // YYYY-MM-DD
  options?: Options;
}

export const useGetAvailableSlotsByDateQuery = ({
  doctorId,
  date,
  options,
}: UseGetAvailableSlotsByDateParams) => {
  return useQuery({
    queryKey: [QueryKeyEnum.TimeSlot, "available", doctorId, date],
    queryFn: () => TimeSlotApi.getByDoctorId(doctorId), // Filter by date on client or add API param
    enabled: !!doctorId && !!date,
    ...options,
  });
};
