import { Gender } from "../enums/gender";

type Patient = {
  patient_id: string;
  userId: string;
  fullName: string;
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
