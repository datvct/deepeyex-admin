import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { DiagnosisResponse } from "../../types/predict";
import { PredictApi } from "../../api/predictApi";

type PredictParams = {
  file: File;
  topK?: number;
};

type Options = Omit<UseMutationOptions<DiagnosisResponse, Error, PredictParams>, "mutationFn">;

function usePredictMutation(options?: Options) {
  return useMutation({
    mutationFn: ({ file, topK = 3 }: PredictParams) => PredictApi.predict(file, topK),
    ...options,
  });
}

export { usePredictMutation };
