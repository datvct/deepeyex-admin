// src/modules/medical-records/types/body.ts

export interface CreateMedicalRecordBody {
  patient_id: string;
  doctor_id: string;
  appointment_id?: string;
  diagnosis: string;
  created_by: string; // "DOCTOR" | "SYSTEM" | "AI"
  note?: string;
  related_record_id?: string;
}

export interface UpdateMedicalRecordBody {
  diagnosis?: string;
  doctor_id?: string;
  notes?: string;
}

export interface InitRecordAndDiagnosisBody {
  patient_id: string;
  disease_code: string;
  confidence: number;
  diagnosis?: string;
  main_image_url: string;
  eye_type?: string; // "LEFT" | "RIGHT" | "BOTH"
  notes?: string;
}

export interface CheckMedicalRecordParams {
  appointment_id: string;
}

// Full Record APIs
export interface AttachmentFile {
  file: any; // Base64 hoặc File
  file_type: string;
}

export interface PrescriptionItemBody {
  drug_name: string;
  dosage: string;
  frequency: string;
  duration_days: number;
  notes?: string;
  start_date: string;
  custom_times?: string[];
}

export interface PrescriptionBody {
  patient_id: string;
  source: string; // "AI" | "DOCTOR"
  description?: string;
  medical_record_id?: string;
  ai_diagnosis_id?: string;
  items: PrescriptionItemBody[];
}

export interface CreateFullRecordBody {
  patient_id: string;
  doctor_id: string;
  appointment_id: string;
  diagnosis: string;
  notes?: string;
  related_record_id?: string;
  attachments?: AttachmentFile[];
  prescription?: PrescriptionBody;
}

export interface CompleteRecordBody {
  record_id: string;
  diagnosis: string;
  notes?: string;
  update_doctor?: string;
  update_patient?: string;
  attachments?: AttachmentFile[];
  prescription?: PrescriptionBody;
}
