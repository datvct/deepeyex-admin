import { ApiResponse } from "../../../shares/types/response";
import { Patient } from "./patient";

type ListPatientsResponse = ApiResponse<Patient[]>;
type GetPatientResponse = ApiResponse<Patient>;
type CreatePatientResponse = ApiResponse<Patient>;
type UpdatePatientResponse = ApiResponse<Patient>;
type DeletePatientResponse = ApiResponse<null>;

export {
  ListPatientsResponse,
  GetPatientResponse,
  CreatePatientResponse,
  UpdatePatientResponse,
  DeletePatientResponse,
};
