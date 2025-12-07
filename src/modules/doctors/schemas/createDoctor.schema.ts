import { z } from "zod";

const phoneRegex = /^[0-9]{8,15}$/;

const fullNameRegex = /^[\p{L}\s.'-]+$/u;

export const specialtyEnum = z.enum([
  "ophthalmology", // Nhãn khoa
  "internal_medicine", // Nội khoa
  "neurology", // Thần kinh
  "endocrinology", // Nội tiết
  "pediatrics", // Nhi khoa
  "receptionist", // Lễ tân
  "dermatology", // Da liễu
]);

export const createDoctorSchema = z.object({
  user_id: z.string().uuid("UserID phải là UUID hợp lệ"),

  full_name: z
    .string()
    .min(1, "Họ và tên không được để trống")
    .regex(fullNameRegex, "Họ và tên không được chứa ký tự đặc biệt"),

  specialty: specialtyEnum,

  hospital_id: z.string().uuid("HospitalID phải là UUID hợp lệ"),

  phone: z
    .string()
    .regex(phoneRegex, "Số điện thoại phải là số và có từ 8 đến 15 chữ số")
    .optional(),

  email: z.string().email("Email không hợp lệ").optional(),

  avatar: z
    .any()
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true;

      return files.every((file: any) => {
        if (file.originFileObj) {
          return file.originFileObj.size < 5 * 1024 * 1024;
        }
        return true;
      });
    }, "Mỗi file ảnh phải nhỏ hơn 5MB"),
});

export type CreateDoctorBody = z.infer<typeof createDoctorSchema>;
