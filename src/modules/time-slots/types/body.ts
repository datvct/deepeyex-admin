import { z } from "zod";
import { createTimeSlotSchema } from "../schemas/createTimeSlot.schema";
import { updateTimeSlotSchema } from "../schemas/updateTimeSlot.schema";

type CreateTimeSlotBody = z.infer<typeof createTimeSlotSchema>;
type UpdateTimeSlotBody = z.infer<typeof updateTimeSlotSchema>;
export { CreateTimeSlotBody, UpdateTimeSlotBody };
