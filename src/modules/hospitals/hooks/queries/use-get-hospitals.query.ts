import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { ListHospitalsResponse } from "../../types/response";
import { HospitalApi } from "../../apis/hospitalApi";

type Options = Omit<
  UseQueryOptions<ListHospitalsResponse, Error, ListHospitalsResponse, QueryKey>,
  "queryKey" | "queryFn"
>;

export function useListHospitalsQuery(options?: Options) {
  return useQuery({
    queryKey: [QueryKeyEnum.Hospital],
    queryFn: () => HospitalApi.getAll(),
    ...options,
  });
}
