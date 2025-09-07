import { z } from "zod";
import { createDoctorSchema } from "../schemas/createDoctor.schema";

type CreateDoctorBody = z.infer<typeof createDoctorSchema>;

export { CreateDoctorBody };
