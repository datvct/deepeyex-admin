// src/modules/medical-records/hooks/mutations/use-complete-record.mutation.ts
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { MedicalRecordApi } from "../../apis/medicalRecordApi";
import { CompleteRecordBody } from "../../types/body";
import { CompleteRecordResponse } from "../../types/response";

type Options = UseMutationOptions<CompleteRecordResponse, Error, CompleteRecordBody>;

export const useCompleteRecordMutation = (options?: Options) => {
  return useMutation({
    mutationFn: (body: CompleteRecordBody) => MedicalRecordApi.completeRecord(body),
    ...options,
  });
};
