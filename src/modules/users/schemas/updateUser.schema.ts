import { createUserSchema } from "./createUser.schema";

export const updateUserSchema = createUserSchema.partial();
