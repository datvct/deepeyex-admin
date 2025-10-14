import { useQuery } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { AppointmentApi } from "../../apis/appointmentApi";


type OnlineAppointmentParams = {
  book_user_id?: string;
  doctor_id?: string;
};

export const useGetAppointmentsOnline = (params: OnlineAppointmentParams) => {
  return useQuery({
    queryKey: [QueryKeyEnum.Appointment, params],
    queryFn: () => AppointmentApi.getOnlineAppointments(params!),
    enabled: !!(params.book_user_id || params.doctor_id),
  });
};
