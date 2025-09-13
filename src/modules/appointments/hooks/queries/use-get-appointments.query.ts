import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { ListAppointmentsResponse } from "../../types/response";
import { AppointmentApi } from "../../apis/appointmentApi";

type Options = Omit<
  UseQueryOptions<ListAppointmentsResponse, Error, ListAppointmentsResponse, QueryKey>,
  "queryKey" | "queryFn"
>;

export function useListAppointmentsQuery(options?: Options) {
  return useQuery({
    queryKey: [QueryKeyEnum.Appointment],
    queryFn: () => AppointmentApi.getAll(),
    ...options,
  });
}
