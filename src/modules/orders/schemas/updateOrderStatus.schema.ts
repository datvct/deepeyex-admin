import { OrderStatus } from "../enums/order-status";
import { z } from "zod";

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus, {
    error: "Trạng thái đơn hàng không hợp lệ",
  }),
});
