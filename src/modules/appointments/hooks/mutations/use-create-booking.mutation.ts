import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AppointmentApi } from "../../apis/appointmentApi";
import { GetAppointmentResponse } from "../../types/response";
import { CreateBookingBody } from "../../types/body";

type Options = Omit<
  UseMutationOptions<GetAppointmentResponse, Error, CreateBookingBody>,
  "mutationFn"
>;

export const useCreateBookingMutation = (options?: Options) => {
  return useMutation({
    mutationFn: (body: CreateBookingBody) => AppointmentApi.createBooking(body),
    ...options,
  });
};
