import { z } from "zod";

export const createAIDiagnosisSchema = z.object({
  patient_id: z.uuid("PatientID phải là UUID hợp lệ"),

  record_id: z.uuid("RecordID phải là UUID hợp lệ"),

  disease_code: z.string().min(1, "Mã bệnh không được để trống"),

  confidence: z.number().min(0, "Độ tin cậy phải từ 0 đến 1").max(1, "Độ tin cậy phải từ 0 đến 1"),

  main_image_url: z.any().optional(),

  eye_type: z.enum(["left", "right", "both"]).optional(),

  notes: z.string().max(500, "Ghi chú không được vượt quá 500 ký tự").optional(),
});

export type CreateAIDiagnosisBody = z.infer<typeof createAIDiagnosisSchema>;
