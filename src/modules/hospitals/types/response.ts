import { ApiResponse } from "../../../shares/types/response";
import { Hospital } from "./hospital";

type ListHospitalsResponse = ApiResponse<Hospital[]>;
type GetHospitalResponse = ApiResponse<Hospital>;
type CreateHospitalResponse = ApiResponse<Hospital>;
type UpdateHospitalResponse = ApiResponse<Hospital>;
type DeleteHospitalResponse = ApiResponse<null>;

export {
  ListHospitalsResponse,
  GetHospitalResponse,
  CreateHospitalResponse,
  UpdateHospitalResponse,
  DeleteHospitalResponse,
};
