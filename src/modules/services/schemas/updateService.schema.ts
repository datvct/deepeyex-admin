// src/modules/services/schemas/updateService.schema.ts
import { z } from "zod";

export const updateServiceSchema = z.object({
  name: z.string().min(1, "Tên dịch vụ không được để trống").optional(),
  duration: z
    .number()
    .min(1, "Thời gian phải lớn hơn 0")
    .max(480, "Thời gian tối đa 480 phút (8 giờ)")
    .optional(),
  price: z.number().min(0, "Giá không được âm").optional(),
});

export type UpdateServiceSchema = z.infer<typeof updateServiceSchema>;
