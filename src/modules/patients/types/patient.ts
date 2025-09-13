import { Gender } from "../enums/gender";

type Patient = {
  patient_id: string;
  user_id: string;
  full_name: string;
  dob: string;
  gender: Gender;
  address?: string;
  phone?: string;
  email?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
};

export { Patient };
