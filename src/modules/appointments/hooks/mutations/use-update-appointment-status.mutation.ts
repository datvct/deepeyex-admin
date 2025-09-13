import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { UpdateAppointmentStatusResponse } from "../../types/response";
import { UpdateAppointmentStatusBody } from "../../types/body";
import { AppointmentApi } from "../../apis/appointmentApi";

type Options = Omit<
  UseMutationOptions<
    UpdateAppointmentStatusResponse,
    Error,
    UpdateAppointmentStatusBody & { appointment_id: string }
  >,
  "mutationFn"
>;

function useUpdateAppointmentStatusMutation(options?: Options) {
  return useMutation({
    mutationFn: async (
      body: UpdateAppointmentStatusBody & { appointment_id: string },
    ): Promise<UpdateAppointmentStatusResponse> => {
      const { appointment_id, status } = body;

      return AppointmentApi.updateStatus(appointment_id, { status });
    },
    ...options,
  });
}

export { useUpdateAppointmentStatusMutation };
