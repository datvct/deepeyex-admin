import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AIDiagnosisApi } from "../../apis/aidiagnosis_api";
import { ListAIDiagnosesResponse } from "../../types/response";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";

type Options = Omit<UseQueryOptions<ListAIDiagnosesResponse, Error>, "queryKey" | "queryFn">;

function useGetApprovedAIDiagnosis(options?: Options) {
  return useQuery<ListAIDiagnosesResponse, Error>({
    queryKey: [QueryKeyEnum.AIDiagnosis, "approved"],
    queryFn: async () => {
      const response = await AIDiagnosisApi.getApproved();
      return response;
    },
    ...options,
  });
}

export { useGetApprovedAIDiagnosis };
