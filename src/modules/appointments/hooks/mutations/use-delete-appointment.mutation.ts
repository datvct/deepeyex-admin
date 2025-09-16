import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { DeleteAppointmentResponse } from "../../types/response";
import { AppointmentApi } from "../../apis/appointmentApi";

type Options = Omit<UseMutationOptions<DeleteAppointmentResponse, Error, string>, "mutationFn">;

function useDeleteAppointmentMutation(options?: Options) {
  return useMutation({
    mutationFn: (appointmentId: string) => AppointmentApi.delete(appointmentId),
    ...options,
  });
}

export { useDeleteAppointmentMutation };
