import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { AIDiagnosisApi } from "../../apis/aidiagnosis_api";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";

type Options = Omit<UseMutationOptions<{ message: string }, Error, void>, "mutationFn">;

function useTrainModelMutation(options?: Options) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => AIDiagnosisApi.trainModel(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.AIDiagnosis] });
    },
    ...options,
  });
}

export { useTrainModelMutation };
