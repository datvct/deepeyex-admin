import { z } from "zod";
import { createDoctorSchema } from "../schemas/createDoctor.schema";
import { updateDoctorSchema } from "../schemas/updateDoctor.schema";

type CreateDoctorBody = z.infer<typeof createDoctorSchema>;
type UpdateDoctorBody = z.infer<typeof updateDoctorSchema>;
export { CreateDoctorBody, UpdateDoctorBody };
