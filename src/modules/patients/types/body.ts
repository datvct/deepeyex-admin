import { z } from "zod";
import { createPatientSchema } from "../schemas/createPatient.schema";
import { updatePatientSchema } from "../schemas/updatePatient.schema";

type CreatePatientBody = z.infer<typeof createPatientSchema>;
type UpdatePatientBody = z.infer<typeof updatePatientSchema>;

export { CreatePatientBody, UpdatePatientBody };
