// src/modules/medical-records/types/medical-record.ts

import { AIDiagnosis } from "../../aidiagnosis/types/aidiagnosis";

export interface Attachment {
  id: string;
  record_id: string;
  file_url: string;
  file_type: string;
  description?: string;
  created_at: string;
}

export interface PrescriptionItem {
  prescription_item_id: string;
  prescription_id: string;
  drug_name: string;
  dosage: string;
  frequency: string;
  duration_days: number;
  notes?: string;
  start_date: string;
  end_date: string;
}

export interface Prescription {
  prescription_id: string;
  ai_diagnosis_id?: string;
  medical_record_id?: string;
  patient_id: string;
  source: string; // "AI" | "DOCTOR"
  description?: string;
  status: string; // "PENDING" | "APPROVED" | "REJECTED"
  items?: PrescriptionItem[];
  created_at: string;
  updated_at: string;
}

export interface MedicalRecord {
  record_id: string;
  patient_id: string;
  appointment_id?: string;
  doctor_id: string;
  diagnosis: string;
  notes?: string;
  related_record_id?: string | null;
  CreatedAt?: string; // API response
  created_at?: string; // API response
  UpdatedAt?: string; // API response
  updated_at?: string; // API response
  ai_diagnoses?: AIDiagnosis[];
  attachments?: Attachment[];
  prescriptions?: Prescription[];
  appointment?: any; // API có thể trả về appointment data
}
