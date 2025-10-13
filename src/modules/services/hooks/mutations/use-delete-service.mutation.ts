// src/modules/services/hooks/mutations/use-delete-service.mutation.ts
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ServiceApi } from "../../apis/serviceApi";
import { ApiResponse } from "../../../../shares/types/response";

type Options = Omit<UseMutationOptions<ApiResponse<null>, Error, string>, "mutationFn">;

export const useDeleteServiceMutation = (options?: Options) => {
  return useMutation<ApiResponse<null>, Error, string>({
    mutationFn: async (serviceId: string) => {
      return await ServiceApi.delete(serviceId);
    },
    ...options,
  });
};
