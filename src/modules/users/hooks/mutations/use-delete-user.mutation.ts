import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { DeleteUserResponse } from "../../types/response";
import { UserApi } from "../../apis/userApi";

type Options = Omit<UseMutationOptions<DeleteUserResponse, Error, string>, "mutationFn">;

function useDeleteUserMutation(options?: Options) {
  return useMutation({
    mutationFn: (userId: string) => UserApi.delete(userId),
    ...options,
  });
}

export { useDeleteUserMutation };
