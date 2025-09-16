import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { DeleteTimeSlotResponse } from "../../types/response";
import { TimeSlotApi } from "../../apis/timeSlotApi";

type Options = Omit<UseMutationOptions<DeleteTimeSlotResponse, Error, string>, "mutationFn">;

function useDeleteTimeSlotMutation(options?: Options) {
  return useMutation({
    mutationFn: (timeSlotId: string) => TimeSlotApi.delete(timeSlotId),
    ...options,
  });
}

export { useDeleteTimeSlotMutation };
