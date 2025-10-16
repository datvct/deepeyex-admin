// src/modules/medical-records/hooks/mutations/use-create-full-record.mutation.ts
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { MedicalRecordApi } from "../../apis/medicalRecordApi";
import { CreateFullRecordBody } from "../../types/body";
import { CreateFullRecordResponse } from "../../types/response";

type Options = UseMutationOptions<CreateFullRecordResponse, Error, CreateFullRecordBody>;

export const useCreateFullRecordMutation = (options?: Options) => {
  return useMutation({
    mutationFn: (body: CreateFullRecordBody) => MedicalRecordApi.createFullRecord(body),
    ...options,
  });
};
