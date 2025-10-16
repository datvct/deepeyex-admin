// src/modules/medical-records/index.ts

// Types
export * from "./types/medical-record";
export * from "./types/body";
export * from "./types/response";

// Enums
export * from "./enums/prescription";

// API
export { MedicalRecordApi } from "./apis/medicalRecordApi";

// Queries
export { useGetMedicalRecordQuery } from "./hooks/queries/use-get-medical-record.query";
export { useGetMedicalRecordsQuery } from "./hooks/queries/use-get-medical-records.query";
export { useCheckMedicalRecordQuery } from "./hooks/queries/use-check-medical-record.query";

// Mutations
export { useCreateMedicalRecordMutation } from "./hooks/mutations/use-create-medical-record.mutation";
export { useUpdateMedicalRecordMutation } from "./hooks/mutations/use-update-medical-record.mutation";
export { useDeleteMedicalRecordMutation } from "./hooks/mutations/use-delete-medical-record.mutation";
export { useInitRecordDiagnosisMutation } from "./hooks/mutations/use-init-record-diagnosis.mutation";
export { useCreateFullRecordMutation } from "./hooks/mutations/use-create-full-record.mutation";
export { useCompleteRecordMutation } from "./hooks/mutations/use-complete-record.mutation";
