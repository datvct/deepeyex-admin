import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { ListDrugsResponse } from "../../types/response";
import { DrugApi } from "../../apis/drugApi";

type Options = Omit<
  UseQueryOptions<ListDrugsResponse, Error, ListDrugsResponse, QueryKey>,
  "queryKey" | "queryFn"
>;

export function useListDrugsQuery(options?: Options) {
  return useQuery({
    queryKey: [QueryKeyEnum.Drug],
    queryFn: () => DrugApi.getAll(),
    ...options,
  });
}
