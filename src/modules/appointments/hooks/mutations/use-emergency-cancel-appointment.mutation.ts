import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { QueryKey } from "@tanstack/react-query";
import { AppointmentApi } from "../../apis/appointmentApi";
import { EmergencyCancelAppointmentResponse } from "../../types/response";

type Options = Omit<
  UseMutationOptions<
    EmergencyCancelAppointmentResponse,
    Error,
    { appointment_id: string; reason: string },
    QueryKey
  >,
  "mutationFn"
>;

function useEmergencyCancelAppointmentMutation(options?: Options) {
  return useMutation({
    mutationFn: async ({
      appointment_id,
      reason,
    }: {
      appointment_id: string;
      reason: string;
    }): Promise<EmergencyCancelAppointmentResponse> => {
      return AppointmentApi.emergencyCancel(appointment_id, reason);
    },
    ...options,
  });
}

export { useEmergencyCancelAppointmentMutation };
