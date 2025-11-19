import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { ListAppointmentsResponse } from "../../types/response";
import { AppointmentApi } from "../../apis/appointmentApi";

export interface UseListAppointmentByHospitalIdQueryParams {
  hospitalId: string;
  filters?: Record<string, any>;
  options?: Omit<
    UseQueryOptions<ListAppointmentsResponse, Error, ListAppointmentsResponse, QueryKey>,
    "queryKey" | "queryFn"
  >;
}

export function useListAppointmentByHospitalIdQuery({
  hospitalId,
  filters,
  options,
}: UseListAppointmentByHospitalIdQueryParams) {
  return useQuery({
    ...options,
    queryKey: [QueryKeyEnum.Appointment, "hospital", hospitalId, filters],
    queryFn: () => AppointmentApi.getAllByHospitalId(hospitalId, filters),
    enabled: options?.enabled !== undefined ? options.enabled : !!hospitalId,
  });
}
