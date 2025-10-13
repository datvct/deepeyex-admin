// src/modules/services/hooks/mutations/use-update-service.mutation.ts
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ServiceApi } from "../../apis/serviceApi";
import { UpdateServiceBody } from "../../types/body";
import { ServiceResponse } from "../../types/response";

type Variables = {
  serviceId: string;
  body: UpdateServiceBody;
};

type Options = Omit<UseMutationOptions<ServiceResponse, Error, Variables>, "mutationFn">;

export const useUpdateServiceMutation = (options?: Options) => {
  return useMutation<ServiceResponse, Error, Variables>({
    mutationFn: async ({ serviceId, body }: Variables) => {
      return await ServiceApi.update(serviceId, body);
    },
    ...options,
  });
};
