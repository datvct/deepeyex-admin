import { z } from "zod";
import { AppointmentStatus } from "../enums/appointment-status";

export const updateAppointmentByReceptionistSchema = z.object({
  // Thông tin bệnh nhân
  patient_full_name: z.string().optional(),
  patient_phone: z.string().optional(),
  patient_email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  // Ghi chú chung về lịch hẹn
  notes: z.string().optional(),
  // Ghi chú nội bộ (sẽ có prefix [LỄ TÂN] tự động ở backend)
  internal_notes: z.string().optional(),
  // Dời lịch hẹn - danh sách slot IDs mới
  new_slot_ids: z.array(z.string()).optional(),
  // Trạng thái lịch hẹn
  status: z.nativeEnum(AppointmentStatus).optional(),
});
