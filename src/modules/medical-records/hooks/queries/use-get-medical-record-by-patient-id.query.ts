// src/modules/medical-records/hooks/queries/use-get-medical-record.query.ts
import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { MedicalRecordResponse } from "../../types/response";
import { MedicalRecordApi } from "../../apis/medicalRecordApi";

type Options = Omit<
  UseQueryOptions<MedicalRecordResponse, Error, MedicalRecordResponse, QueryKey>,
  "queryKey" | "queryFn"
>;

export const useGetMedicalRecordByPatientIdQuery = (patientId: string, options?: Options) => {
  return useQuery({
    queryKey: [QueryKeyEnum.MedicalRecord, "patient", patientId],
    queryFn: () => MedicalRecordApi.getByPatientId(patientId),
    enabled: !!patientId,
    ...options,
  });
};
