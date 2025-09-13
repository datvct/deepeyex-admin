import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { UpdateUserResponse } from "../../types/response";
import { UpdateUserBody } from "../../types/body";
import { UserApi } from "../../apis/userApi";

type UpdateUserVariables = {
  id: string;
  body: UpdateUserBody;
};

type Options = Omit<
  UseMutationOptions<UpdateUserResponse, Error, UpdateUserVariables>,
  "mutationFn"
>;

function useUpdateUserMutation(options?: Options) {
  return useMutation({
    mutationFn: ({ id, body }: UpdateUserVariables) => {
      return UserApi.update(id, body);
    },
    ...options,
  });
}

export { useUpdateUserMutation };
