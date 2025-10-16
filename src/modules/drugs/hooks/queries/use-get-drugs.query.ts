import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { ListDrugsResponse } from "../../types/response";
import { DrugApi } from "../../apis/drugApi";

export interface UseListDrugsQueryParams {
  filters?: Record<string, any>;
  options?: Omit<
    UseQueryOptions<ListDrugsResponse, Error, ListDrugsResponse, QueryKey>,
    "queryKey" | "queryFn"
  >;
}

export function useListDrugsQuery({ filters, options }: UseListDrugsQueryParams = {}) {
  return useQuery({
    queryKey: [QueryKeyEnum.Drug, filters],
    queryFn: () => DrugApi.getAll(filters),
    ...options,
  });
}
