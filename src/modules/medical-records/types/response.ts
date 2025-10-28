// src/modules/medical-records/types/response.ts
import { ApiResponse } from "../../../shares/types/response";
import { AIDiagnosis } from "../../aidiagnosis/types/aidiagnosis";
import { MedicalRecord } from "./medical-record";

export interface MedicalRecordByPatientIdData {
  records: MedicalRecord[];
}

export type MedicalRecordResponse = ApiResponse<MedicalRecordByPatientIdData>;

export type ListMedicalRecordsResponse = ApiResponse<MedicalRecord[]>;

export interface InitRecordAndDiagnosisResponseData {
  record_id: string;
  patient_id: string;
  created_at: string;
  ai_diagnosis: AIDiagnosis;
}

export type InitRecordAndDiagnosisResponse = ApiResponse<InitRecordAndDiagnosisResponseData>;

export interface CheckMedicalRecordResponseData {
  action: "create" | "update";
  record: MedicalRecord | [];
}

export type CheckMedicalRecordResponse = ApiResponse<CheckMedicalRecordResponseData>;

export type DeleteMedicalRecordResponse = ApiResponse<null>;

// Response data trực tiếp là MedicalRecord
export type CreateFullRecordResponse = ApiResponse<MedicalRecord>;

export type CompleteRecordResponse = ApiResponse<MedicalRecord>;
