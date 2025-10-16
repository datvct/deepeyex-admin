// src/modules/appointments/types/follow-up.ts

export interface CreateFollowUpAppointmentBody {
  patient_id: string;
  doctor_id: string;
  hospital_id: string;
  book_user_id: string;
  service_name?: string;
  notes?: string;
  slot_ids: string[];
  related_record_id?: string;
}

export interface CreateFollowUpAppointmentResponse {
  status: number;
  message: string;
  data: {
    appointment_id: string;
    appointment_code: string;
    patient_id: string;
    doctor_id: string;
    hospital_id: string;
    status: string;
    created_at: string;
  };
}
