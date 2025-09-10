import { createPatientSchema } from "./createPatient.schema";

export const updatePatientSchema = createPatientSchema.partial();
