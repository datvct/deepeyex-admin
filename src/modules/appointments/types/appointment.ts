// src/modules/appointments/types/appointment.ts
import { Specialty } from "../../doctors/enums/specialty";
import { Doctor } from "../../doctors/types/doctor";
import { Patient } from "../../patients/types/patient";
import { TimeSlot } from "../../time-slots/types/time-slot";
import { AppointmentStatus } from "../enums/appointment-status";

export type Appointment = {
  appointment_id: string;
  appointment_code: string;
  patient_id: string;
  hospital_id: string;
  specialty: Specialty;
  doctor_id: string;
  status: AppointmentStatus;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  checked_in_at?: string | null;
  service_name?: string;
  related_record_id?: string | null; // ID của medical record liên quan (nếu là tái khám)
  doctor: Doctor;
  time_slots: TimeSlot[];
  patient: Patient;
};
