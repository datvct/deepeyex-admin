// src/modules/medical-records/enums/prescription.ts

export enum PrescriptionSource {
  AI = "AI",
  DOCTOR = "DOCTOR",
}

export enum PrescriptionStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export const PrescriptionSourceLabel: Record<PrescriptionSource, string> = {
  [PrescriptionSource.AI]: "AI",
  [PrescriptionSource.DOCTOR]: "Bác sĩ",
};

export const PrescriptionStatusLabel: Record<PrescriptionStatus, string> = {
  [PrescriptionStatus.PENDING]: "Chờ duyệt",
  [PrescriptionStatus.APPROVED]: "Đã duyệt",
  [PrescriptionStatus.REJECTED]: "Từ chối",
};
