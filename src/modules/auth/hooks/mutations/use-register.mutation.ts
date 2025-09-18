import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AuthApi, RegisterRequest, SuccessResponse } from "../../apis/authApi";

type RegisterOptions = Omit<
  UseMutationOptions<SuccessResponse, Error, RegisterRequest>,
  "mutationFn"
>;

function useRegisterMutation(options?: RegisterOptions) {
  return useMutation({
    mutationFn: async (form: RegisterRequest) => {
      const res = await AuthApi.register(form);
      return res;
    },
    ...options,
  });
}

export { useRegisterMutation };
