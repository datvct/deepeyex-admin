// src/modules/services/hooks/queries/use-get-service-by-id.query.ts
import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { ServiceResponse } from "../../types/response";
import { ServiceApi } from "../../apis/serviceApi";

type Options = Omit<
  UseQueryOptions<ServiceResponse, Error, ServiceResponse, QueryKey>,
  "queryKey" | "queryFn"
>;

export const useGetServiceByIdQuery = (serviceId: string, options?: Options) => {
  return useQuery({
    queryKey: [QueryKeyEnum.Service, serviceId],
    queryFn: () => ServiceApi.getById(serviceId),
    enabled: !!serviceId,
    ...options,
  });
};
