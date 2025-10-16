import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { ListOrdersResponse } from "../../types/response";
import { OrderApi } from "../../apis/orderApi";

export interface UseListOrdersQueryParams {
  filters?: Record<string, any>;
  options?: Omit<
    UseQueryOptions<ListOrdersResponse, Error, ListOrdersResponse, QueryKey>,
    "queryKey" | "queryFn"
  >;
}

export function useListOrdersQuery({ filters, options }: UseListOrdersQueryParams = {}) {
  return useQuery({
    queryKey: [QueryKeyEnum.Order, filters],
    queryFn: () => OrderApi.getAll(filters),
    ...options,
  });
}
