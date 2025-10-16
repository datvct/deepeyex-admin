// src/modules/services/hooks/queries/use-get-services.query.ts
import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { ListServicesResponse } from "../../types/response";
import { ServiceApi } from "../../apis/serviceApi";

export interface UseGetServicesQueryParams {
  filters?: Record<string, any>;
  options?: Omit<
    UseQueryOptions<ListServicesResponse, Error, ListServicesResponse, QueryKey>,
    "queryKey" | "queryFn"
  >;
}

export const useGetServicesQuery = ({ filters, options }: UseGetServicesQueryParams = {}) => {
  return useQuery({
    queryKey: [QueryKeyEnum.Service, filters],
    queryFn: () => ServiceApi.getAll(filters),
    ...options,
  });
};
