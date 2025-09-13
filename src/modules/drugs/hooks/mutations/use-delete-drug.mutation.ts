import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { DeleteDrugResponse } from "../../types/response";
import { DrugApi } from "../../apis/drugApi";

type Options = Omit<UseMutationOptions<DeleteDrugResponse, Error, string>, "mutationFn">;

function useDeleteDrugMutation(options?: Options) {
  return useMutation({
    mutationFn: (drugId: string) => DrugApi.delete(drugId),
    ...options,
  });
}

export { useDeleteDrugMutation };
