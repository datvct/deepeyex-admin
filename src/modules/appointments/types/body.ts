import { z } from "zod";
import { AppointmentStatus } from "../enums/appointment-status";
import { updateAppointmentStatusSchema } from "../schemas/updateAppointmentStatus.schema";
import { updateAppointmentByReceptionistSchema } from "../schemas/updateAppointmentByReceptionist.schema";
import { createBookingSchema, orderItemSchema } from "../schemas/createBooking.schema";
import { PaymentStatus } from "../enums/payment-status";

type UpdateAppointmentStatusBody = z.infer<typeof updateAppointmentStatusSchema>;
type UpdateAppointmentStatusRequest = {
  status: AppointmentStatus;
};

type UpdateAppointmentByReceptionistBody = z.infer<typeof updateAppointmentByReceptionistSchema>;
type UpdateAppointmentByReceptionistRequest = {
  patient_full_name?: string;
  patient_phone?: string;
  patient_email?: string;
  notes?: string;
  internal_notes?: string;
  new_slot_ids?: string[];
  status?: AppointmentStatus;
};

type CreateBookingBody = z.infer<typeof createBookingSchema>;
type OrderItemBody = z.infer<typeof orderItemSchema>;
type CreateBookingRequest = {
  book_user_id: string;
  doctor_id: string;
  hospital_id: string;
  notes?: string;
  order_items?: OrderItemBody[];
  patient_id: string;
  payment_status?: PaymentStatus;
  service_name?: string;
  slot_ids: string[];
};

export {
  UpdateAppointmentStatusBody,
  UpdateAppointmentStatusRequest,
  UpdateAppointmentByReceptionistBody,
  UpdateAppointmentByReceptionistRequest,
  CreateBookingBody,
  CreateBookingRequest,
  OrderItemBody,
};
