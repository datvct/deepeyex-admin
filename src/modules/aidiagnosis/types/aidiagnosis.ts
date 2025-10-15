export type AIDiagnosis = {
  id: string;
  patient_id: string;
  record_id: string;
  disease_code: string;
  confidence: number;
  main_image_url: string;
  eye_type?: string;
  notes?: string;
  status: string;
  created_at: string;
  verified_by?: string;
  verified_at?: string;
};
