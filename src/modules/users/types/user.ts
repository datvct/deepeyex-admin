import { Role } from "../enums/role";

type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  firebase_uid?: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};

export { User };
