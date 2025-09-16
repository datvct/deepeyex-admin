import { z } from "zod";
import { AppointmentStatus } from "../enums/appointment-status";
import { updateAppointmentStatusSchema } from "../schemas/updateAppointmentStatus.schema";

type UpdateAppointmentStatusBody = z.infer<typeof updateAppointmentStatusSchema>;
type UpdateAppointmentStatusRequest = {
  status: AppointmentStatus;
};

export { UpdateAppointmentStatusBody, UpdateAppointmentStatusRequest };
