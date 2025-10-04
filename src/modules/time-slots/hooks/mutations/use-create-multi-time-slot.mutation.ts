import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { TimeSlotApi } from "../../apis/timeSlotApi";
import { CreateMultiShiftSlotsBody } from "../../types/time-slot";
import { CreateMultiShiftSlotsResponse } from "../../types/response";

type Options = Omit<
  UseMutationOptions<CreateMultiShiftSlotsResponse, Error, CreateMultiShiftSlotsBody>,
  "mutationFn"
>;

function useCreateMultiTimeSlotMutation(options?: Options) {
  return useMutation({
    mutationFn: (body: CreateMultiShiftSlotsBody) => TimeSlotApi.createMultiShift(body),
    ...options,
  });
}

export { useCreateMultiTimeSlotMutation };
