// src/modules/medical-records/hooks/queries/use-check-medical-record.query.ts
import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { CheckMedicalRecordResponse } from "../../types/response";
import { MedicalRecordApi } from "../../apis/medicalRecordApi";

type Options = Omit<
  UseQueryOptions<CheckMedicalRecordResponse, Error, CheckMedicalRecordResponse, QueryKey>,
  "queryKey" | "queryFn"
>;

export const useCheckMedicalRecordQuery = (appointmentId: string, options?: Options) => {
  return useQuery({
    queryKey: [QueryKeyEnum.MedicalRecord, "check", appointmentId],
    queryFn: () => MedicalRecordApi.checkByAppointment({ appointment_id: appointmentId }),
    enabled: !!appointmentId,
    ...options,
  });
};
