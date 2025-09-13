enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELED = "CANCELED",
  DELIVERED = "DELIVERED",
}

export { OrderStatus };

export const OrderStatusLabel: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "Đang chờ xử lý",
  [OrderStatus.PAID]: "Đã thanh toán",
  [OrderStatus.CANCELED]: "Đã hủy",
  [OrderStatus.DELIVERED]: "Đã giao hàng",
};
