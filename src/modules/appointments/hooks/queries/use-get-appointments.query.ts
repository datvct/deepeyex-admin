import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { ListAppointmentsResponse } from "../../types/response";
import { AppointmentApi } from "../../apis/appointmentApi";

export interface UseListAppointmentsQueryParams {
  filters?: Record<string, any>;
  options?: Omit<
    UseQueryOptions<ListAppointmentsResponse, Error, ListAppointmentsResponse, QueryKey>,
    "queryKey" | "queryFn"
  >;
}

export function useListAppointmentsQuery({
  filters,
  options,
}: UseListAppointmentsQueryParams = {}) {
  return useQuery({
    queryKey: [QueryKeyEnum.Appointment, filters],
    queryFn: () => AppointmentApi.getAll(filters),
    ...options,
  });
}
