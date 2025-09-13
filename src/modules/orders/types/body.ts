import { z } from "zod";
import { updateOrderStatusSchema } from "../schemas/updateOrderStatus.schema";
import { OrderStatus } from "../enums/order-status";

type UpdateOrderStatusBody = z.infer<typeof updateOrderStatusSchema>;
type UpdateOrderStatusRequest = {
  status: OrderStatus;
};

export { UpdateOrderStatusBody, UpdateOrderStatusRequest };
