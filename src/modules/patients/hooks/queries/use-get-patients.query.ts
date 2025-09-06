import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { PatientApi } from "../../apis/patientApi";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { ListPatientsResponse } from "../../types/response";

type Options = Omit<
  UseQueryOptions<
    ListPatientsResponse,
    Error,
    ListPatientsResponse,
    QueryKey
  >,
  "queryKey" | "queryFn"
>;

export function useListPatientsQuery(options?: Options) {
  return useQuery({
    queryKey: [QueryKeyEnum.Patient],
    queryFn: () => PatientApi.getAll(),
    ...options,
  });
}
