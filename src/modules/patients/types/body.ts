import { z } from "zod";
import { createPatientSchema } from "../schemas/createPatient.schema";

type CreatePatientBody = z.infer<typeof createPatientSchema>;

export { CreatePatientBody };
