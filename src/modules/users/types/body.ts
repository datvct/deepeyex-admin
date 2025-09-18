import { z } from "zod";
import { createUserSchema } from "../schemas/createUser.schema";
import { updateUserSchema } from "../schemas/updateUser.schema";
import { updatePasswordSchema } from "../schemas/resetPasswordByEmail.schema";

type CreateUserBody = z.infer<typeof createUserSchema>;
type UpdateUserBody = z.infer<typeof updateUserSchema>;
type UpdatePasswordByEmailBody = z.infer<typeof updatePasswordSchema>;

export { CreateUserBody, UpdateUserBody, UpdatePasswordByEmailBody };
