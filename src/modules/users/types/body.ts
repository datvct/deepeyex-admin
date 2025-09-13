import { z } from "zod";
import { createUserSchema } from "../schemas/createUser.schema";
import { updateUserSchema } from "../schemas/updateUser.schema";

type CreateUserBody = z.infer<typeof createUserSchema>;
type UpdateUserBody = z.infer<typeof updateUserSchema>;
export { CreateUserBody, UpdateUserBody };
