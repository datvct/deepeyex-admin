import { ApiResponse } from "../../../shares/types/response";
import { Doctor } from "./doctor";

type ListDoctorsResponse = ApiResponse<Doctor[]>;
type GetDoctorResponse = ApiResponse<Doctor>;
type CreateDoctorResponse = ApiResponse<Doctor>;
type UpdateDoctorResponse = ApiResponse<Doctor>;
type DeleteDoctorResponse = ApiResponse<null>;

export {
  ListDoctorsResponse,
  GetDoctorResponse,
  CreateDoctorResponse,
  UpdateDoctorResponse,
  DeleteDoctorResponse,
};
