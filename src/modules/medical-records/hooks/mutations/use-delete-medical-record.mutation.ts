// src/modules/medical-records/hooks/mutations/use-delete-medical-record.mutation.ts
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { MedicalRecordApi } from "../../apis/medicalRecordApi";
import { DeleteMedicalRecordResponse } from "../../types/response";

type Options = UseMutationOptions<DeleteMedicalRecordResponse, Error, string>;

export const useDeleteMedicalRecordMutation = (options?: Options) => {
  return useMutation({
    mutationFn: (recordId: string) => MedicalRecordApi.delete(recordId),
    ...options,
  });
};
