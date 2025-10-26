import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { QueryKey } from "@tanstack/react-query";
import { AppointmentApi } from "../../apis/appointmentApi";
import { UpdateAppointmentStatusResponse } from "../../types/response";

type Options = Omit<
  UseMutationOptions<UpdateAppointmentStatusResponse, Error, string, QueryKey>,
  "mutationFn"
>;

function useCancelAppointmentMutation(options?: Options) {
  return useMutation({
    mutationFn: async (appointment_id: string): Promise<UpdateAppointmentStatusResponse> => {
      return AppointmentApi.cancel(appointment_id);
    },
    ...options,
  });
}

export { useCancelAppointmentMutation };
