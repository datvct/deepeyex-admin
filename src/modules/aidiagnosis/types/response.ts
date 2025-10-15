import { ApiResponse } from "../../../shares/types/response";
import { AIDiagnosis } from "./aidiagnosis";

type AIDiagnosisResponse = ApiResponse<AIDiagnosis>;
type ListAIDiagnosesResponse = ApiResponse<AIDiagnosis[]>;
type VerifyAIDiagnosisResponse = ApiResponse<{ message: string }>;
export type { AIDiagnosisResponse, ListAIDiagnosesResponse, VerifyAIDiagnosisResponse };
