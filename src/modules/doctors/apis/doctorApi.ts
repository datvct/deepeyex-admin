// src/apis/doctorApi.ts
import { AxiosInstance } from "axios";
import api from "../../../shares/configs/axios";
import { CreateDoctorBody } from "../schemas/createDoctor.schema";
import {
  CreateDoctorResponse,
  DeleteDoctorResponse,
  GetDoctorResponse,
  ListDoctorsResponse,
  UpdateDoctorResponse,
} from "../types/response";
import { Doctor } from "../types/doctor";

const endpoint = "/hospital/doctors";

class DoctorClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  // ---------------- Create Doctor ----------------
  async create(form: FormData): Promise<CreateDoctorResponse> {
    const response = await this.client.post<CreateDoctorResponse>(endpoint, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  // ---------------- List All Doctors ----------------
  async getAll(): Promise<ListDoctorsResponse> {
    const response = await this.client.get<ListDoctorsResponse>(endpoint);
    return response.data;
  }

  // ---------------- Get Doctor By UserID ----------------
  async getByUserId(userId: string): Promise<GetDoctorResponse> {
    const response = await this.client.get<GetDoctorResponse>(`${endpoint}/user/${userId}`);
    return response.data;
  }

  // ---------------- Get Doctor By DoctorID ----------------
  async getById(doctorId: string): Promise<Doctor> {
    const response = await this.client.get<Doctor>(`${endpoint}/${doctorId}`);
    return response.data;
  }

  // ---------------- Get Doctors By HospitalID ----------------
  async getByHospitalId(hospitalId: string): Promise<ListDoctorsResponse> {
    const response = await this.client.get<ListDoctorsResponse>(
      `${endpoint}/hospital/${hospitalId}`,
    );
    return response.data;
  }

  // ---------------- Update Doctor ----------------
  async update(doctorId: string, updateData: FormData): Promise<UpdateDoctorResponse> {
    const response = await this.client.put<UpdateDoctorResponse>(
      `${endpoint}/${doctorId}`,
      updateData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
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
