import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { UpdateOrderStatusResponse } from "../../types/response";
import { OrderApi } from "../../apis/orderApi";
import { UpdateOrderStatusBody } from "../../types/body";

type Options = Omit<
  UseMutationOptions<
    UpdateOrderStatusResponse,
    Error,
    UpdateOrderStatusBody & { order_id: string }
  >,
  "mutationFn"
>;

function useUpdateOrderStatusMutation(options?: Options) {
  return useMutation({
    mutationFn: async (
      body: UpdateOrderStatusBody & { order_id: string },
    ): Promise<UpdateOrderStatusResponse> => {
      const { order_id, status } = body;

      // Gửi dữ liệu JSON đơn giản thay vì FormData
      return OrderApi.updateStatus(order_id, { status });
    },
    ...options,
  });
}

export { useUpdateOrderStatusMutation };
