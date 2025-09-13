import { AppointmentStatus } from "../enums/appointment-status";
import { z } from "zod";

export const updateAppointmentStatusSchema = z.object({
  status: z.nativeEnum(AppointmentStatus, {
    error: "Trạng thái đơn đặt lịch không hợp lệ",
  }),
});
