import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { AIDiagnosisApi } from "../../apis/aidiagnosis_api";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";

type VerifyDiagnosisParams = {
  id: string;
  doctor_id: string;
  status: string;
  notes?: string;
  signature?: File;
};

type Options = Omit<
  UseMutationOptions<{ message: string }, Error, VerifyDiagnosisParams>,
  "mutationFn"
>;

function useVerifyDiagnosisMutation(options?: Options) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, doctor_id, status, notes, signature }: VerifyDiagnosisParams) =>
      AIDiagnosisApi.verify(id, { doctor_id, status, notes, signature }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeyEnum.AIDiagnosis] });
    },
    ...options,
  });
}

export { useVerifyDiagnosisMutation };
