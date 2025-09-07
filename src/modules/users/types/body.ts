import { z } from "zod";
import { createUserSchema } from "../schemas/createUser.schema";

type CreateUserBody = z.infer<typeof createUserSchema>;

export { CreateUserBody };
