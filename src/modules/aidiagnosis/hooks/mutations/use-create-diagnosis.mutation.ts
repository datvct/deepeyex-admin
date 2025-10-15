import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AIDiagnosisResponse } from "../../types/response";
import { CreateAIDiagnosisBody } from "../../schemas/createAiDiagnosis.schema";
import { AIDiagnosisApi } from "../../apis/aidiagnosis_api";

type CreateAIDiagnosisOptions = Omit<
  UseMutationOptions<AIDiagnosisResponse, Error, CreateAIDiagnosisBody>,
  "mutationFn"
>;

function useCreateAIDiagnosisMutation(options?: CreateAIDiagnosisOptions) {
  return useMutation<AIDiagnosisResponse, Error, CreateAIDiagnosisBody>({
    mutationFn: (form) => AIDiagnosisApi.create(form),
    ...options,
  });
}

export { useCreateAIDiagnosisMutation };
