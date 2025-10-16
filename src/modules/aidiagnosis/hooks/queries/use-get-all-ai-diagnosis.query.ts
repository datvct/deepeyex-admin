import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AIDiagnosisApi } from "../../apis/aidiagnosis_api";
import { ListAIDiagnosesResponse } from "../../types/response";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { AIDiagnosis } from "../../types/aidiagnosis";

type Options = Omit<UseQueryOptions<ListAIDiagnosesResponse, Error>, "queryKey" | "queryFn">;

function useGetAllAIDiagnosis(options?: Options) {
  return useQuery<ListAIDiagnosesResponse, Error>({
    queryKey: [QueryKeyEnum.AIDiagnosis],
    queryFn: async () => {
      const response = await AIDiagnosisApi.getAllPending();
      return response;
    },
    ...options,
  });
}

export { useGetAllAIDiagnosis };
