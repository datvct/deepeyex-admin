import z from "zod";

export const createTimeSlotSchema = z.object({
  doctor_id: z.string().uuid("Doctor ID phải là UUID hợp lệ"),
  start_time: z.string().datetime({ message: "Thời gian bắt đầu không hợp lệ" }),
  end_time: z.string().datetime({ message: "Thời gian kết thúc không hợp lệ" }),
  capacity: z.number().min(1, "Capacity phải lớn hơn hoặc bằng 1"),
});
