import { ApiResponse } from "../../../shares/types/response";
import { Order } from "./order";

type ListOrdersResponse = ApiResponse<Order[]>;
type GetOrderResponse = ApiResponse<Order>;
type CreateOrderResponse = ApiResponse<Order>;
type UpdateOrderResponse = ApiResponse<Order>;
type DeleteOrderResponse = ApiResponse<null>;
type UpdateOrderStatusResponse = ApiResponse<Order>;

export {
  ListOrdersResponse,
  GetOrderResponse,
  CreateOrderResponse,
  UpdateOrderResponse,
  DeleteOrderResponse,
  UpdateOrderStatusResponse,
};
