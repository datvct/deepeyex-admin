// src/modules/appointments/hooks/mutations/use-create-follow-up.mutation.ts
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AppointmentApi } from "../../apis/appointmentApi";
import {
  CreateFollowUpAppointmentBody,
  CreateFollowUpAppointmentResponse,
} from "../../types/follow-up";

type Options = UseMutationOptions<
  CreateFollowUpAppointmentResponse,
  Error,
  CreateFollowUpAppointmentBody
>;

export const useCreateFollowUpMutation = (options?: Options) => {
  return useMutation({
    mutationFn: (body: CreateFollowUpAppointmentBody) => AppointmentApi.createFollowUp(body),
    ...options,
  });
};
