// src/modules/medical-records/hooks/queries/use-get-medical-records.query.ts
import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { ListMedicalRecordsResponse } from "../../types/response";
import { MedicalRecordApi } from "../../apis/medicalRecordApi";

type Options = Omit<
  UseQueryOptions<ListMedicalRecordsResponse, Error, ListMedicalRecordsResponse, QueryKey>,
  "queryKey" | "queryFn"
>;

export const useGetMedicalRecordsQuery = (options?: Options) => {
  return useQuery({
    queryKey: [QueryKeyEnum.MedicalRecord],
    queryFn: () => MedicalRecordApi.getAll(),
    ...options,
  });
};
