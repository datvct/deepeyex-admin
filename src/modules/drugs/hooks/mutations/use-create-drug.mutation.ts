import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { CreateDrugResponse } from "../../types/response";
import { CreateDrugBody } from "../../types/body";
import { DrugApi } from "../../apis/drugApi";

type Options = Omit<UseMutationOptions<CreateDrugResponse, Error, CreateDrugBody>, "mutationFn">;

function useCreateDrugMutation(options?: Options) {
  return useMutation({
    mutationFn: async (body: CreateDrugBody) => {
      const form = new FormData();

      Object.entries(body).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "image") {
            const files = value as any[]; // value là array
            if (files.length > 0 && files[0].originFileObj) {
              form.append("image", files[0].originFileObj);
            }
          } else {
            form.append(key, value as string);
          }
        }
      });
      return DrugApi.create(form);
    },
    ...options,
  });
}

export { useCreateDrugMutation };
