import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { DoctorApi } from "../../apis/doctorApi";
import { ListDoctorsResponse } from "../../types/response";

type Options = Omit<
  UseQueryOptions<ListDoctorsResponse, Error, ListDoctorsResponse, QueryKey>,
  "queryKey" | "queryFn"
>;

interface UseGetDoctorsByHospitalIdQueryOptions extends Options {
  hospitalId: string;
}

export const useGetDoctorsByHospitalIdQuery = (options: UseGetDoctorsByHospitalIdQueryOptions) => {
  const { hospitalId, ...queryOptions } = options;

  return useQuery({
    queryKey: [QueryKeyEnum.Doctor, "hospital", hospitalId],
    queryFn: () => DoctorApi.getByHospitalId(hospitalId),
    enabled: !!hospitalId,
    ...queryOptions,
  });
};
