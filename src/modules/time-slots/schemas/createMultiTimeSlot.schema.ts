import z from "zod";

export const CreateMultiShiftSlotsSchema = z.object({
  doctor_id: z.string(),
  shifts: z.array(
    z.object({
      date: z.string(), // có thể refine YYYY-MM-DD
      slots: z.array(z.enum(["morning", "afternoon", "evening"])),
    }),
  ),
});
