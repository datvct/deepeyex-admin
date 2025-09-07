import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { ListDoctorsResponse } from "../../types/response";
import { DoctorApi } from "../../apis/doctorApi";

type Options = Omit<
  UseQueryOptions<ListDoctorsResponse, Error, ListDoctorsResponse, QueryKey>,
  "queryKey" | "queryFn"
>;

export function useListDoctorsQuery(options?: Options) {
  return useQuery({
    queryKey: [QueryKeyEnum.Doctor],
    queryFn: () => DoctorApi.getAll(),
    ...options,
  });
}
