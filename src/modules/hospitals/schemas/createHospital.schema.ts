import { z } from "zod";

const phoneRegex = /^[0-9]{8,15}$/;

const hospitalNameRegex = /^[\p{L}0-9\s.,-]+$/u;

export const createHospitalSchema = z.object({
  name: z
    .string()
    .min(1, "Tên bệnh viện không được để trống")
    .regex(hospitalNameRegex, "Tên bệnh viện không được chứa ký tự đặc biệt"),

  address: z.string().optional(),

  phone: z
    .string()
    .regex(phoneRegex, "Số điện thoại phải là số và có từ 8 đến 15 chữ số")
    .optional(),

  email: z.string().email("Email không hợp lệ").optional(),

  logo: z
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

export type CreateHospitalBody = z.infer<typeof createHospitalSchema>;
