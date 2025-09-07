import z from "zod";

export const createHospitalSchema = z.object({
  name: z.string().min(1, "Tên bệnh viện không được để trống"),
  address: z.string().optional(),
  phone: z
    .string()
    .regex(/^[0-9]{8,15}$/, "Số điện thoại không hợp lệ")
    .optional(),
  email: z.string().email("Email không hợp lệ").optional(),
  logo_url: z.string().url("Logo phải là URL hợp lệ").optional(),
});
