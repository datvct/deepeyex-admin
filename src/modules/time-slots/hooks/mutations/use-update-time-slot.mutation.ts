import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { UpdateTimeSlotBody } from "../../types/body";
import { UpdateTimeSlotResponse } from "../../types/response";
import { TimeSlotApi } from "../../apis/timeSlotApi";

type Options = Omit<
  UseMutationOptions<UpdateTimeSlotResponse, Error, UpdateTimeSlotBody & { time_slot_id: string }>,
  "mutationFn"
>;

function useUpdateTimeSlotMutation(options?: Options) {
  return useMutation({
    mutationFn: ({ time_slot_id, ...rest }: UpdateTimeSlotBody & { time_slot_id: string }) => {
      return TimeSlotApi.update(time_slot_id, rest);
    },
    ...options,
  });
}

export { useUpdateTimeSlotMutation };
