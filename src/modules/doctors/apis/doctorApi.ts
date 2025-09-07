// src/apis/doctorApi.ts
import { AxiosInstance } from "axios";
import api from "../../../shares/configs/axios";
import { CreateDoctorBody } from "../schemas/createDoctor.schema";
import { CreateDoctorResponse, DeleteDoctorResponse, ListDoctorsResponse } from "../types/response";
import { Doctor } from "../types/doctor";

const endpoint = "/doctors";

class DoctorClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  // ---------------- Create Doctor ----------------
  async create(doctorBody: CreateDoctorBody): Promise<CreateDoctorResponse> {
    const response = await this.client.post<CreateDoctorResponse>(endpoint, doctorBody);
    return response.data;
  }

  // ---------------- List All Doctors ----------------
  async getAll(): Promise<ListDoctorsResponse> {
    const response = await this.client.get<ListDoctorsResponse>(endpoint);
    return response.data;
  }

  // ---------------- Get Doctor By UserID ----------------
  async getByUserId(userId: string): Promise<Doctor> {
    const response = await this.client.get<Doctor>(`${endpoint}/user/${userId}`);
    return response.data;
  }

  // ---------------- Get Doctor By DoctorID ----------------
  async getById(doctorId: string): Promise<Doctor> {
    const response = await this.client.get<Doctor>(`${endpoint}/${doctorId}`);
    return response.data;
  }

  // ---------------- Update Doctor ----------------
  async update(
    doctorId: string,
    updateData: Partial<Omit<Doctor, "doctorId" | "createdAt" | "updatedAt">>,
  ): Promise<Doctor> {
    const response = await this.client.put<Doctor>(`${endpoint}/${doctorId}`, updateData);
    return response.data;
  }

  // ---------------- Delete Doctor ----------------
  async delete(doctorId: string): Promise<DeleteDoctorResponse> {
    const response = await this.client.delete<DeleteDoctorResponse>(`${endpoint}/${doctorId}`);
    return response.data;
  }
}

const DoctorApi = new DoctorClient();
export { DoctorApi };
