import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { DeletePatientResponse } from "../../types/response";
import { PatientApi } from "../../apis/patientApi";

type Options = Omit<UseMutationOptions<DeletePatientResponse, Error, string>, "mutationFn">;

function useDeletePatientMutation(options?: Options) {
  return useMutation({
    mutationFn: (patientId: string) => PatientApi.delete(patientId),
    ...options,
  });
}

export { useDeletePatientMutation };
