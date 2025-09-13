import { z } from "zod";
import { Gender } from "../enums/gender";

// Giới hạn tuổi: bệnh nhân không thể trên 200 tuổi hoặc dưới 0
const validateDob = (val: string) => {
  const date = new Date(val);
  if (isNaN(date.getTime())) return false;

  const ageDifMs = Date.now() - date.getTime();
  const ageDate = new Date(ageDifMs); // miliseconds -> Date
  const age = Math.abs(ageDate.getUTCFullYear() - 1970);

  return age >= 0 && age <= 200;
};

// Regex kiểm tra số điện thoại chỉ chứa số và có 9–11 chữ số
const phoneRegex = /^[0-9]{9,11}$/;

// Regex tên không chứa ký tự số hoặc ký tự đặc biệt
const nameRegex = /^[\p{L}\s]+$/u;
// Schema cho body khi create patient (form upload)
export const createPatientSchema = z.object({
  user_id: z.uuid({ message: "UserID phải là UUID hợp lệ" }),

  full_name: z
    .string()
    .min(1, "Họ tên không được để trống")
    .regex(nameRegex, "Họ tên không được chứa số hoặc ký tự đặc biệt"),

  dob: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Ngày sinh không hợp lệ" })
    .refine(validateDob, { message: "Tuổi phải trong khoảng 0–200" }),

  gender: z.enum(["male", "female"], {
    message: "Giới tính phải là male hoặc female",
  }),

  address: z.string().optional(),

  phone: z
    .string()
    .regex(phoneRegex, "Số điện thoại phải là số và có từ 9 đến 11 chữ số")
    .optional(),

  email: z.email("Email không hợp lệ"),

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

export type CreatePatientBody = z.infer<typeof createPatientSchema>;
