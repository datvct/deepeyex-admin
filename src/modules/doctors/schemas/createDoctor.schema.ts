import z from "zod";

export const specialtyEnum = z.enum([
  "ophthalmology", // Nhãn khoa
  "internal_medicine", // Nội khoa
  "neurology", // Thần kinh
  "endocrinology", // Nội tiết
  "pediatrics", // Nhi khoa
]);

export const createDoctorSchema = z.object({
  user_id: z.string().uuid("UserID phải là UUID hợp lệ"),
  full_name: z.string().min(1, "Họ và tên không được để trống"),
  specialty: specialtyEnum,
  hospital_id: z.string().uuid("HospitalID phải là UUID hợp lệ"),
  phone: z
    .string()
    .regex(/^[0-9]{8,15}$/, "Số điện thoại không hợp lệ")
    .optional(),
  email: z.string().email("Email không hợp lệ").optional(),
  avatar_url: z.string().url("Avatar phải là URL hợp lệ").optional(),
});

export type CreateDoctorBody = z.infer<typeof createDoctorSchema>;
