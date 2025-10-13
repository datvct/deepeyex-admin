// src/modules/services/hooks/mutations/use-remove-service-from-doctor.mutation.ts
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ServiceApi } from "../../apis/serviceApi";
import { ApiResponse } from "../../../../shares/types/response";

type Variables = {
  doctorId: string;
  serviceId: string;
};

type Options = Omit<UseMutationOptions<ApiResponse<null>, Error, Variables>, "mutationFn">;

export const useRemoveServiceFromDoctorMutation = (options?: Options) => {
  return useMutation<ApiResponse<null>, Error, Variables>({
    mutationFn: async ({ doctorId, serviceId }: Variables) => {
      return await ServiceApi.removeFromDoctor(doctorId, serviceId);
    },
    ...options,
  });
};
