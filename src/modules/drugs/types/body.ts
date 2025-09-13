import { z } from "zod";
import { createDrugSchema } from "../schemas/createDrug.schema";
import { updateDrugSchema } from "../schemas/updateDrug.schema";

type CreateDrugBody = z.infer<typeof createDrugSchema>;
type UpdateDrugBody = z.infer<typeof updateDrugSchema>;

export { CreateDrugBody, UpdateDrugBody };
