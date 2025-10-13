// src/modules/services/schemas/createService.schema.ts
import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string().min(1, "Tên dịch vụ không được để trống"),
  duration: z
    .number()
    .min(1, "Thời gian phải lớn hơn 0")
    .max(480, "Thời gian tối đa 480 phút (8 giờ)"),
  price: z.number().min(0, "Giá không được âm"),
});

export type CreateServiceSchema = z.infer<typeof createServiceSchema>;
