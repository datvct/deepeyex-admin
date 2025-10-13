// src/modules/services/hooks/mutations/use-create-service.mutation.ts
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ServiceApi } from "../../apis/serviceApi";
import { CreateServiceBody } from "../../types/body";
import { ServiceResponse } from "../../types/response";

type Options = Omit<UseMutationOptions<ServiceResponse, Error, CreateServiceBody>, "mutationFn">;

export const useCreateServiceMutation = (options?: Options) => {
  return useMutation<ServiceResponse, Error, CreateServiceBody>({
    mutationFn: async (body: CreateServiceBody) => {
      return await ServiceApi.create(body);
    },
    ...options,
  });
};
