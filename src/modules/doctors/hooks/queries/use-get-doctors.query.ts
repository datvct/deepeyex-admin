import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { ListDoctorsResponse } from "../../types/response";
import { DoctorApi } from "../../apis/doctorApi";

export interface UseListDoctorsQueryParams {
  filters?: Record<string, any>;
  options?: Omit<
    UseQueryOptions<ListDoctorsResponse, Error, ListDoctorsResponse, QueryKey>,
    "queryKey" | "queryFn"
  >;
}

export function useListDoctorsQuery({ filters, options }: UseListDoctorsQueryParams = {}) {
  return useQuery({
    queryKey: [QueryKeyEnum.Doctor, filters],
    queryFn: () => DoctorApi.getAll(filters),
    ...options,
  });
}
