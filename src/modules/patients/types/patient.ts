import { Gender } from "../enums/gender";

type Patient = {
  patientId: string; 
  userId: string; 
  fullName: string;
  dob: string; 
  gender: Gender; 
  address?: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  createdAt: string; 
  updatedAt: string; 
};

export { Patient };
