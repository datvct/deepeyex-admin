import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { DeleteOrderResponse } from "../../types/response";
import { OrderApi } from "../../apis/orderApi";

type Options = Omit<UseMutationOptions<DeleteOrderResponse, Error, string>, "mutationFn">;

function useDeleteOrderMutation(options?: Options) {
  return useMutation({
    mutationFn: (orderId: string) => OrderApi.delete(orderId),
    ...options,
  });
}

export { useDeleteOrderMutation };
