import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { HospitalApi } from "../../apis/hospitalApi";
import { DeleteHospitalResponse } from "../../types/response";

type Options = Omit<UseMutationOptions<DeleteHospitalResponse, Error, string>, "mutationFn">;

function useDeleteHospitalMutation(options?: Options) {
  return useMutation({
    mutationFn: (hospitalId: string) => HospitalApi.delete(hospitalId),
    ...options,
  });
}

export { useDeleteHospitalMutation };
