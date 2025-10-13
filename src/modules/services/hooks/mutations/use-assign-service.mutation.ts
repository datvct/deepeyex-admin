// src/modules/services/hooks/mutations/use-assign-service.mutation.ts
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ServiceApi } from "../../apis/serviceApi";
import { AssignServiceBody } from "../../types/body";
import { ApiResponse } from "../../../../shares/types/response";

type Options = Omit<UseMutationOptions<ApiResponse<null>, Error, AssignServiceBody>, "mutationFn">;

export const useAssignServiceMutation = (options?: Options) => {
  return useMutation<ApiResponse<null>, Error, AssignServiceBody>({
    mutationFn: async (body: AssignServiceBody) => {
      return await ServiceApi.assignToDoctor(body);
    },
    ...options,
  });
};
