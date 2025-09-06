import z from "zod";

// Schema cho body khi create patient
export const createPatientSchema = z.object({
  user_id: z.string().uuid("UserID phải là UUID hợp lệ"),
  full_name: z.string().min(1, "Họ tên không được để trống"),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Ngày sinh không hợp lệ",
  }),
  gender: z.enum(["male", "female"]),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email không hợp lệ"),
  avatar_url: z.string().url("Avatar phải là URL hợp lệ").optional(),
});