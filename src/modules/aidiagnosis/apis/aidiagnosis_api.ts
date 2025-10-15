import { AxiosInstance } from "axios";
import { AIDiagnosisResponse, ListAIDiagnosesResponse } from "../types/response";
import { CreateAIDiagnosisBody } from "../schemas/createAiDiagnosis.schema";
import { AIDiagnosis } from "../types/aidiagnosis";
import api from "../../../shares/configs/axios";

const endpoint = "/hospital/ai-diagnoses";

class AIDiagnosisClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  // ---------------- Create AI Diagnosis ----------------
  async create(data: CreateAIDiagnosisBody): Promise<AIDiagnosisResponse> {
    const formData = new FormData();

    formData.append("patient_id", data.patient_id);
    formData.append("record_id", data.record_id);
    formData.append("disease_code", data.disease_code);
    formData.append("confidence", data.confidence.toString());

    if (data.eye_type) formData.append("eye_type", data.eye_type);
    if (data.notes) formData.append("notes", data.notes);
    if (data.main_image_url instanceof File) {
      formData.append("main_image", data.main_image_url);
    }

    const response = await this.client.post<AIDiagnosisResponse>(endpoint, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  }

  // ---------------- Get All Pending Diagnoses ----------------
  async getAllPending(): Promise<ListAIDiagnosesResponse> {
    const response = await this.client.get<ListAIDiagnosesResponse>(endpoint);
    return response.data;
  }

  // ---------------- Get Diagnoses By Patient ID ----------------
  async getByPatientId(patientId: string): Promise<AIDiagnosisResponse[]> {
    const response = await this.client.get<AIDiagnosisResponse[]>(
      `${endpoint}/patient/${patientId}`,
    );
    return response.data;
  }

  // ---------------- Verify Diagnosis ----------------
  async verify(
    id: string,
    data: {
      doctor_id: string;
      status: string;
      notes?: string;
      signature?: File;
    },
  ): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append("doctor_id", data.doctor_id);
    formData.append("status", data.status);

    if (data.notes) {
      formData.append("notes", data.notes);
    }

    if (data.signature) {
      formData.append("signature", data.signature);
    }

    const response = await this.client.put<{ message: string }>(
      `${endpoint}/${id}/verify`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  }
}

const AIDiagnosisApi = new AIDiagnosisClient();
export { AIDiagnosisApi };
