import { createDoctorSchema } from "./createDoctor.schema";

export const updateDoctorSchema = createDoctorSchema.partial();
