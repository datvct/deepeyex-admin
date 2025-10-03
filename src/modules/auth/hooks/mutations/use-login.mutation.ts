// src/hooks/auth/useLoginMutation.ts
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  AuthApi,
  LoginRequest,
  SuccessResponse,
  TokenResponse,
  ErrorResponse,
} from "../../apis/authApi";
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { setTokens } from "../../../../shares/stores/authSlice";
import { Doctor } from "../../../doctors/types/doctor";

type LoginOptions = Omit<
  UseMutationOptions<SuccessResponse<TokenResponse>, AxiosError<ErrorResponse>, LoginRequest>,
  "mutationFn"
>;

export function useLoginMutation(options?: LoginOptions) {
  const dispatch = useDispatch();

  return useMutation<SuccessResponse<TokenResponse>, AxiosError<ErrorResponse>, LoginRequest>({
    mutationFn: async (form: LoginRequest) => {
      return await AuthApi.login(form);
    },
    onSuccess: (res, variables, context) => {
      //sau khi đăng nhập thành công call api get doctor by user id
      // lưu access token vào redux
      dispatch(
        setTokens({
          accessToken: res.data?.access_token || "",
          refreshToken: "",
          userId: res.data?.user_id || "",
          role: res.data?.role || "",
        }),
      );
      options?.onSuccess?.(res, variables, context);
    },
    onError: (err, variables, context) => {
      options?.onError?.(err, variables, context);
    },
  });
}
