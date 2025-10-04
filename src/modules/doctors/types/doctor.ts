import { Specialty } from "../enums/specialty";

type Doctor = {
  doctor_id: string;
  full_name: string;
  phone?: string;
  email?: string;
  image?: string;
  specialty: Specialty;
  hospital_id: string;
  user_id: number;
  createdAt: string;
  updatedAt: string;
};

export { Doctor };
