import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { ListOrdersResponse } from "../../types/response";
import { OrderApi } from "../../apis/orderApi";

type Options = Omit<
  UseQueryOptions<ListOrdersResponse, Error, ListOrdersResponse, QueryKey>,
  "queryKey" | "queryFn"
>;

export function useListOrdersQuery(options?: Options) {
  return useQuery({
    queryKey: [QueryKeyEnum.Order],
    queryFn: () => OrderApi.getAll(),
    ...options,
  });
}
