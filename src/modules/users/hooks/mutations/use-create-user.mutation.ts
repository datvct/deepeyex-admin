import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { CreateUserResponse } from "../../types/response";
import { CreateUserBody } from "../../types/body";
import { UserApi } from "../../apis/userApi";

type Options = Omit<UseMutationOptions<CreateUserResponse, Error, CreateUserBody>, "mutationFn">;

function useCreateUserMutation(options?: Options) {
  return useMutation({
    mutationFn: (body: CreateUserBody) => UserApi.create(body),
    ...options,
  });
}

export { useCreateUserMutation };
