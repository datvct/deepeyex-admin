// src/apis/patientApi.ts
import { AxiosInstance } from "axios";
import api from "../../../shares/configs/axios";
import { Patient } from "../types/patient";
import {
  CreatePatientResponse,
  DeletePatientResponse,
  ListPatientsResponse,
} from "../types/response";
import { CreatePatientBody } from "../types/body";

const endpoint = "/patients";

class PatientClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  // ---------------- Create Patient ----------------
  async create(patientBody: CreatePatientBody): Promise<CreatePatientResponse> {
    const response = await this.client.post<CreatePatientResponse>(endpoint, patientBody);
    return response.data;
  }

  // ---------------- List All Patients ----------------
  async getAll(): Promise<ListPatientsResponse> {
    const response = await this.client.get<ListPatientsResponse>(endpoint);
    return response.data;
  }

  // ---------------- Get Patient By UserID ----------------
  async getByUserId(userId: string): Promise<Patient> {
    const response = await this.client.get<Patient>(`${endpoint}/user/${userId}`);
    return response.data;
  }

  // ---------------- Get Patient By PatientID ----------------
  async getById(patientId: string): Promise<Patient> {
    const response = await this.client.get<Patient>(`${endpoint}/${patientId}`);
    return response.data;
  }

  // ---------------- Update Patient ----------------
  async update(
    patientId: string,
    updateData: Partial<Omit<Patient, "patientId" | "createdAt" | "updatedAt">>,
  ): Promise<Patient> {
    const response = await this.client.put<Patient>(`${endpoint}/${patientId}`, updateData);
    return response.data;
  }

  // ---------------- Delete Patient ----------------
  async delete(patientId: string): Promise<DeletePatientResponse> {
    const response = await this.client.delete<DeletePatientResponse>(`${endpoint}/${patientId}`);
    return response.data;
  }
}

const PatientApi = new PatientClient();
export { PatientApi };
