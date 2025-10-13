// src/modules/services/hooks/queries/use-get-services-by-doctor-id.query.ts
import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { ListServicesResponse } from "../../types/response";
import { ServiceApi } from "../../apis/serviceApi";

type Options = Omit<
  UseQueryOptions<ListServicesResponse, Error, ListServicesResponse, QueryKey>,
  "queryKey" | "queryFn"
>;

export const useGetServicesByDoctorIdQuery = (doctorId: string, options?: Options) => {
  return useQuery({
    queryKey: [QueryKeyEnum.Service, "doctor", doctorId],
    queryFn: () => ServiceApi.getByDoctorId(doctorId),
    enabled: !!doctorId,
    ...options,
  });
};
