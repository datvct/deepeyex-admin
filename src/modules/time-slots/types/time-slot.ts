import { Appointment } from "../../appointments/types/appointment";
import { Doctor } from "../../doctors/types/doctor";

type TimeSlot = {
  slot_id: string;
  doctor_id: string;
  start_time: string;
  end_time: string;
  capacity: number;
  created_at: string;
  updated_at: string;
  doctor: Doctor;
  appointment_id?: string;
  appointment?: Appointment;
};

export interface CreateMultiShiftSlotsBody {
  doctor_id: string;
  shifts: {
    date: string; // YYYY-MM-DD
    slots: ("morning" | "afternoon" | "evening")[];
  }[];
}

export { TimeSlot };
