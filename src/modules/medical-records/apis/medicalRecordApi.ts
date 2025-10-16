// src/modules/medical-records/apis/medicalRecordApi.ts
import { AxiosInstance } from "axios";
import api from "../../../shares/configs/axios";
import {
  CreateMedicalRecordBody,
  UpdateMedicalRecordBody,
  InitRecordAndDiagnosisBody,
  CheckMedicalRecordParams,
  CreateFullRecordBody,
  CompleteRecordBody,
} from "../types/body";
import {
  MedicalRecordResponse,
  ListMedicalRecordsResponse,
  InitRecordAndDiagnosisResponse,
  CheckMedicalRecordResponse,
  DeleteMedicalRecordResponse,
  CreateFullRecordResponse,
  CompleteRecordResponse,
} from "../types/response";

const endpoint = "/hospital/medical_records";

class MedicalRecordClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = api;
  }

  // ---------------- Create MedicalRecord ----------------
  async create(body: CreateMedicalRecordBody): Promise<MedicalRecordResponse> {
    const response = await this.client.post<MedicalRecordResponse>(endpoint, body);
    return response.data;
  }

  // ---------------- Get MedicalRecord by ID ----------------
  async getById(recordId: string): Promise<MedicalRecordResponse> {
    const response = await this.client.get<MedicalRecordResponse>(`${endpoint}/${recordId}`);
    return response.data;
  }

  // ---------------- List All MedicalRecords ----------------
  async getAll(): Promise<ListMedicalRecordsResponse> {
    const response = await this.client.get<ListMedicalRecordsResponse>(endpoint);
    return response.data;
  }

  // ---------------- Update MedicalRecord ----------------
  async update(recordId: string, body: UpdateMedicalRecordBody): Promise<MedicalRecordResponse> {
    const response = await this.client.put<MedicalRecordResponse>(`${endpoint}/${recordId}`, body);
    return response.data;
  }

  // ---------------- Delete MedicalRecord ----------------
  async delete(recordId: string): Promise<DeleteMedicalRecordResponse> {
    const response = await this.client.delete<DeleteMedicalRecordResponse>(
      `${endpoint}/${recordId}`,
    );
    return response.data;
  }

  // ---------------- Init MedicalRecord and AI Diagnosis ----------------
  async initRecordAndDiagnosis(
    body: InitRecordAndDiagnosisBody,
  ): Promise<InitRecordAndDiagnosisResponse> {
    const response = await this.client.post<InitRecordAndDiagnosisResponse>(
      `${endpoint}/init`,
      body,
    );
    return response.data;
  }

  // ---------------- Check MedicalRecord by Appointment ----------------
  async checkByAppointment(params: CheckMedicalRecordParams): Promise<CheckMedicalRecordResponse> {
    const response = await this.client.get<CheckMedicalRecordResponse>(`${endpoint}/check`, {
      params,
    });
    return response.data;
  }

  // ---------------- Create Full Record ----------------
  async createFullRecord(body: CreateFullRecordBody): Promise<CreateFullRecordResponse> {
    const formData = new FormData();

    // Required fields
    formData.append("patient_id", body.patient_id);
    formData.append("doctor_id", body.doctor_id);
    formData.append("diagnosis", body.diagnosis);

    // Optional text fields
    if (body.appointment_id) {
      formData.append("appointment_id", body.appointment_id);
    }
    if (body.notes) {
      formData.append("notes", body.notes);
    }
    if (body.related_record_id) {
      formData.append("related_record_id", body.related_record_id);
    }

    // Prescription as JSON string
    if (body.prescription) {
      formData.append("prescription", JSON.stringify(body.prescription));
    }

    // Attachments - append files và file_types
    if (body.attachments && body.attachments.length > 0) {
      const fileTypes: string[] = [];
      body.attachments.forEach((att) => {
        if (att.file instanceof File) {
          formData.append("files", att.file); // Key: "files" (multiple)
          fileTypes.push(att.file_type);
        }
      });
      // File types as comma-separated string
      if (fileTypes.length > 0) {
        formData.append("file_types", fileTypes.join(","));
      }
    }

    const response = await this.client.post<CreateFullRecordResponse>(
      `/hospital/full-records/full`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  }

  // ---------------- Complete Record (Update Full) ----------------
  async completeRecord(body: CompleteRecordBody): Promise<CompleteRecordResponse> {
    const formData = new FormData();

    // Required fields
    formData.append("record_id", body.record_id);
    formData.append("diagnosis", body.diagnosis);

    // Optional text fields
    if (body.notes) {
      formData.append("notes", body.notes);
    }
    if (body.update_doctor) {
      formData.append("update_doctor", body.update_doctor);
    }
    if (body.update_patient) {
      formData.append("update_patient", body.update_patient);
    }

    // Prescription as JSON string
    if (body.prescription) {
      formData.append("prescription", JSON.stringify(body.prescription));
    }

    // Attachments - append files và file_types
    if (body.attachments && body.attachments.length > 0) {
      const fileTypes: string[] = [];
      body.attachments.forEach((att) => {
        if (att.file instanceof File) {
          formData.append("files", att.file); // Key: "files" (multiple)
          fileTypes.push(att.file_type);
        }
      });
      // File types as comma-separated string
      if (fileTypes.length > 0) {
        formData.append("file_types", fileTypes.join(","));
      }
    }

    const response = await this.client.put<CompleteRecordResponse>(
      `/hospital/full-records/complete`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  }
}

const MedicalRecordApi = new MedicalRecordClient();
export { MedicalRecordApi };
