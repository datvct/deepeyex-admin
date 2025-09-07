import { z } from "zod";
import { createHospitalSchema } from "../schemas/createHospital.schema";

type CreateHospitalBody = z.infer<typeof createHospitalSchema>;

export { CreateHospitalBody };
