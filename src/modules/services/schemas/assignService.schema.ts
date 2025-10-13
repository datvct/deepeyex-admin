// src/modules/services/schemas/assignService.schema.ts
import { z } from "zod";

export const assignServiceSchema = z.object({
  doctor_id: z.string().min(1, "Vui lòng chọn bác sĩ"),
  service_id: z.string().min(1, "Vui lòng chọn dịch vụ"),
});

export type AssignServiceSchema = z.infer<typeof assignServiceSchema>;
