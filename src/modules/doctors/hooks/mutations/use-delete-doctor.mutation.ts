import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { DeleteDoctorResponse } from "../../types/response";
import { DoctorApi } from "../../apis/doctorApi";

type Options = Omit<UseMutationOptions<DeleteDoctorResponse, Error, string>, "mutationFn">;

function useDeleteDoctorMutation(options?: Options) {
  return useMutation({
    mutationFn: (doctorId: string) => DoctorApi.delete(doctorId),
    ...options,
  });
}

export { useDeleteDoctorMutation };
