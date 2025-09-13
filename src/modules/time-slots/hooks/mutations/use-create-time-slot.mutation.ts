import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { CreateTimeSlotResponse } from "../../types/response";
import { CreateTimeSlotBody } from "../../types/body";
import { TimeSlotApi } from "../../apis/timeSlotApi";

type Options = Omit<
  UseMutationOptions<CreateTimeSlotResponse, Error, CreateTimeSlotBody>,
  "mutationFn"
>;

function useCreateTimeSlotMutation(options?: Options) {
  return useMutation({
    mutationFn: (body: CreateTimeSlotBody) => TimeSlotApi.create(body),
    ...options,
  });
}

export { useCreateTimeSlotMutation };
