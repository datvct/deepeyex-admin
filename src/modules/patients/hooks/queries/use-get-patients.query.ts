import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { PatientApi } from "../../apis/patientApi";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { ListPatientsResponse } from "../../types/response";

export interface UseListPatientsQueryParams {
  filters?: Record<string, any>;
  options?: Omit<
    UseQueryOptions<ListPatientsResponse, Error, ListPatientsResponse, QueryKey>,
    "queryKey" | "queryFn"
  >;
}

export function useListPatientsQuery({ filters, options }: UseListPatientsQueryParams = {}) {
  return useQuery({
    queryKey: [QueryKeyEnum.Patient, filters],
    queryFn: () => PatientApi.getAll(filters),
    ...options,
  });
}
