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
};

export { TimeSlot };
