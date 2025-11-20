import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { UpdateAppointmentResponse } from "../../types/response";
import { UpdateAppointmentByReceptionistBody } from "../../types/body";
import { AppointmentApi } from "../../apis/appointmentApi";

type Options = Omit<
  UseMutationOptions<
    UpdateAppointmentResponse,
    Error,
    UpdateAppointmentByReceptionistBody & { appointment_id: string }
  >,
  "mutationFn"
>;

const useUpdateAppointmentByReceptionistMutation = (options?: Options) => {
  return useMutation({
    mutationFn: async (
      body: UpdateAppointmentByReceptionistBody & { appointment_id: string },
    ): Promise<UpdateAppointmentResponse> => {
      const { appointment_id, ...updateData } = body;
      return AppointmentApi.updateByReceptionist(appointment_id, updateData);
    },
    ...options,
  });
};

export { useUpdateAppointmentByReceptionistMutation };
