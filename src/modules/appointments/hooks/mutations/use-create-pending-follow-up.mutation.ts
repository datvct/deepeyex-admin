import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { QueryKey } from "@tanstack/react-query";
import {
  CreatePendingFollowUpBody,
  CreateFollowUpAppointmentResponse,
} from "../../types/follow-up";
import { AppointmentApi } from "../../apis/appointmentApi";

type Options = Omit<
  UseMutationOptions<CreateFollowUpAppointmentResponse, Error, CreatePendingFollowUpBody, QueryKey>,
  "mutationFn"
>;

function useCreatePendingFollowUpMutation(options?: Options) {
  return useMutation({
    mutationFn: async (
      body: CreatePendingFollowUpBody,
    ): Promise<CreateFollowUpAppointmentResponse> => {
      return AppointmentApi.createPendingFollowUp(body);
    },
    ...options,
  });
}

export { useCreatePendingFollowUpMutation };
