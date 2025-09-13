import { ApiResponse } from "../../../shares/types/response";
import { Appointment } from "./appointment";

type ListAppointmentsResponse = ApiResponse<Appointment[]>;
type GetAppointmentResponse = ApiResponse<Appointment>;
type CreateAppointmentResponse = ApiResponse<Appointment>;
type UpdateAppointmentResponse = ApiResponse<Appointment>;
type DeleteAppointmentResponse = ApiResponse<null>;
type UpdateAppointmentStatusResponse = ApiResponse<Appointment>;

export {
  ListAppointmentsResponse,
  GetAppointmentResponse,
  CreateAppointmentResponse,
  UpdateAppointmentResponse,
  DeleteAppointmentResponse,
  UpdateAppointmentStatusResponse,
};
