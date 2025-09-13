import { ApiResponse } from "../../../shares/types/response";
import { Drug } from "./drug";

type ListDrugsResponse = ApiResponse<Drug[]>;
type GetDrugResponse = ApiResponse<Drug>;
type CreateDrugResponse = ApiResponse<Drug>;
type UpdateDrugResponse = ApiResponse<Drug>;
type DeleteDrugResponse = ApiResponse<null>;

export {
  ListDrugsResponse,
  GetDrugResponse,
  CreateDrugResponse,
  UpdateDrugResponse,
  DeleteDrugResponse,
};
