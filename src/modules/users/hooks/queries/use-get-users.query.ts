import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { UserApi } from "../../apis/userApi";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { ListUsersResponse } from "../../types/response";

type Options = Omit<
  UseQueryOptions<ListUsersResponse, Error, ListUsersResponse, QueryKey>,
  "queryKey" | "queryFn"
>;

export function useListUsersQuery(options?: Options) {
  return useQuery({
    queryKey: [QueryKeyEnum.User],
    queryFn: () => UserApi.getAll(),
    ...options,
  });
}
