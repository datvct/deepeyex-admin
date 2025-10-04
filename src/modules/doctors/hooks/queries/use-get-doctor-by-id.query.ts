import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { DoctorApi } from "../../apis/doctorApi";
import { Doctor } from "../../types/doctor";

type Options = Omit<UseQueryOptions<Doctor, Error, Doctor, QueryKey>, "queryKey" | "queryFn">;

interface UseGetDoctorByIdQueryOptions extends Options {
  doctorId: string;
}

export const useGetDoctorByIdQuery = (options: UseGetDoctorByIdQueryOptions) => {
  const { doctorId, ...queryOptions } = options;

  return useQuery({
    queryKey: [QueryKeyEnum.Doctor, doctorId],
    queryFn: () => DoctorApi.getById(doctorId),
    enabled: !!doctorId,
    ...queryOptions,
  });
};
