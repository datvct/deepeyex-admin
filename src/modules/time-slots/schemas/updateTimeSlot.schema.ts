import { createTimeSlotSchema } from "./createTimeSlot.schema";

export const updateTimeSlotSchema = createTimeSlotSchema.partial();
