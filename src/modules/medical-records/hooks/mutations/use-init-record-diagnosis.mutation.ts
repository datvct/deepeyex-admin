// src/modules/medical-records/hooks/mutations/use-init-record-diagnosis.mutation.ts
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { MedicalRecordApi } from "../../apis/medicalRecordApi";
import { InitRecordAndDiagnosisBody } from "../../types/body";
import { InitRecordAndDiagnosisResponse } from "../../types/response";

type Options = UseMutationOptions<
  InitRecordAndDiagnosisResponse,
  Error,
  InitRecordAndDiagnosisBody
>;

export const useInitRecordDiagnosisMutation = (options?: Options) => {
  return useMutation({
    mutationFn: (body: InitRecordAndDiagnosisBody) => MedicalRecordApi.initRecordAndDiagnosis(body),
    ...options,
  });
};
