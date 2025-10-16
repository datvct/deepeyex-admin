import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { ListHospitalsResponse } from "../../types/response";
import { HospitalApi } from "../../apis/hospitalApi";

type Options = Omit<
  UseQueryOptions<ListHospitalsResponse, Error, ListHospitalsResponse, QueryKey>,
  "queryKey" | "queryFn"
>;

export interface UseListHospitalsQueryParams extends Options {
  filters?: Record<string, any>;
}

export function useListHospitalsQuery(options?: UseListHospitalsQueryParams) {
  const { filters, ...queryOptions } = options || {};

  return useQuery({
    queryKey: [QueryKeyEnum.Hospital, filters],
    queryFn: () => HospitalApi.getAll(filters),
    ...queryOptions,
  });
}
