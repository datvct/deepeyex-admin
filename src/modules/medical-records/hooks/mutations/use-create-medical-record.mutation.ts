// src/modules/medical-records/hooks/mutations/use-create-medical-record.mutation.ts
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { MedicalRecordApi } from "../../apis/medicalRecordApi";
import { CreateMedicalRecordBody } from "../../types/body";
import { MedicalRecordResponse } from "../../types/response";

type Options = UseMutationOptions<MedicalRecordResponse, Error, CreateMedicalRecordBody>;

export const useCreateMedicalRecordMutation = (options?: Options) => {
  return useMutation({
    mutationFn: (body: CreateMedicalRecordBody) => MedicalRecordApi.create(body),
    ...options,
  });
};
