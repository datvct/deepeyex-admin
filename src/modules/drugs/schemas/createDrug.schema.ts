import { z } from "zod";

const drugNameRegex = /^[\p{L}0-9\s.,()%-]+$/u;

export const createDrugSchema = z.object({
  drug_id: z.string().uuid("ID thuốc phải là UUID hợp lệ").optional(),

  name: z
    .string()
    .min(1, "Tên thuốc không được để trống")
    .max(100, "Tên thuốc không được vượt quá 100 ký tự")
    .regex(drugNameRegex, "Tên thuốc không được chứa ký tự đặc biệt"),

  description: z.string().optional(),

  price: z.coerce
    .number()
    .refine((value) => !isNaN(value), { message: "Giá thuốc phải là số" })
    .positive("Giá thuốc phải lớn hơn 0"),

  image: z
    .any()
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return files.every((file: any) => {
        if (file.originFileObj) {
          return file.originFileObj.size < 5 * 1024 * 1024; // < 5MB
        }
        return true;
      });
    }, "Mỗi file ảnh phải nhỏ hơn 5MB"),

  stock_quantity: z.coerce
    .number()
    .refine((value) => !isNaN(value), { message: "Số lượng tồn kho phải là số" })
    .min(0, "Số lượng tồn kho không được nhỏ hơn 0")
    .default(0),

  discount_percent: z.coerce
    .number()
    .refine((value) => !isNaN(value), { message: "Phần trăm giảm giá phải là số" })
    .min(0, "Phần trăm giảm giá không được nhỏ hơn 0")
    .max(100, "Phần trăm giảm giá không được lớn hơn 100")
    .default(0),
});

export type CreateDrugBody = z.infer<typeof createDrugSchema>;
