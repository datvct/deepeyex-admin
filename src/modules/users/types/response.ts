import { ApiResponse } from "../../../shares/types/response";
import { User } from "./user";

type ListUsersResponse = ApiResponse<User[]>;
type GetUserResponse = ApiResponse<User>;
type CreateUserResponse = ApiResponse<User>;
type UpdateUserResponse = ApiResponse<User>;
type DeleteUserResponse = ApiResponse<null>;

export {
  ListUsersResponse,
  GetUserResponse,
  CreateUserResponse,
  UpdateUserResponse,
  DeleteUserResponse,
};
