import { z } from "zod";
import { createHospitalSchema } from "../schemas/createHospital.schema";
import { updateHospitalSchema } from "../schemas/updateHospital.schema";

type CreateHospitalBody = z.infer<typeof createHospitalSchema>;
type UpdateHospitalBody = z.infer<typeof updateHospitalSchema>;

export { CreateHospitalBody, UpdateHospitalBody };
