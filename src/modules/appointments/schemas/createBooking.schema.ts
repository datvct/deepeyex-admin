import { z } from "zod";
import { PaymentStatus } from "../enums/payment-status";

export const orderItemSchema = z.object({
  drug_id: z.string().optional(),
  item_name: z.string().min(1, "Tên item là bắt buộc"),
  price: z.number().min(0, "Giá phải lớn hơn hoặc bằng 0"),
  quantity: z.number().int().min(1, "Số lượng phải lớn hơn 0"),
  service_id: z.string().optional(),
});

export const createBookingSchema = z.object({
  book_user_id: z.string().min(1, "book_user_id là bắt buộc"),
  doctor_id: z.string().min(1, "doctor_id là bắt buộc"),
  hospital_id: z.string().min(1, "hospital_id là bắt buộc"),
  notes: z.string().optional(),
  order_items: z.array(orderItemSchema).optional().default([]),
  patient_id: z.string().min(1, "patient_id là bắt buộc"),
  payment_status: z.nativeEnum(PaymentStatus).optional().default(PaymentStatus.PENDING),
  service_name: z.string().optional(),
  slot_ids: z.array(z.string()).min(1, "Cần ít nhất 1 slot_id"),
});
