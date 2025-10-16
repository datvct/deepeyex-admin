import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { UserApi } from "../../apis/userApi";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { ListUsersResponse } from "../../types/response";

type Options = Omit<
  UseQueryOptions<ListUsersResponse, Error, ListUsersResponse, QueryKey>,
  "queryKey" | "queryFn"
>;

interface UseListUsersQueryParams extends Options {
  filters?: Record<string, any>;
}

export function useListUsersQuery(options?: UseListUsersQueryParams) {
  const { filters, ...queryOptions } = options || {};

  return useQuery({
    queryKey: [QueryKeyEnum.User, filters],
    queryFn: () => UserApi.getAll(filters),
    ...queryOptions,
  });
}
