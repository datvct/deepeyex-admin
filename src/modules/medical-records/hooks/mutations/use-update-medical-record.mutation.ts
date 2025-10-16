// src/modules/medical-records/hooks/mutations/use-update-medical-record.mutation.ts
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { MedicalRecordApi } from "../../apis/medicalRecordApi";
import { UpdateMedicalRecordBody } from "../../types/body";
import { MedicalRecordResponse } from "../../types/response";

interface UpdateMedicalRecordVariables {
  recordId: string;
  body: UpdateMedicalRecordBody;
}

type Options = UseMutationOptions<MedicalRecordResponse, Error, UpdateMedicalRecordVariables>;

export const useUpdateMedicalRecordMutation = (options?: Options) => {
  return useMutation({
    mutationFn: ({ recordId, body }: UpdateMedicalRecordVariables) =>
      MedicalRecordApi.update(recordId, body),
    ...options,
  });
};
