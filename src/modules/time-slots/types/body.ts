import { z } from "zod";
import { createTimeSlotSchema } from "../schemas/createTimeSlot.schema";
import { updateTimeSlotSchema } from "../schemas/updateTimeSlot.schema";
import { CreateMultiShiftSlotsSchema } from "../schemas/createMultiTimeSlot.schema";

type CreateTimeSlotBody = z.infer<typeof createTimeSlotSchema>;
type UpdateTimeSlotBody = z.infer<typeof updateTimeSlotSchema>;
type CreateMultiTimeSlotBody = z.infer<typeof CreateMultiShiftSlotsSchema>;

export { CreateTimeSlotBody, UpdateTimeSlotBody, CreateMultiTimeSlotBody };
