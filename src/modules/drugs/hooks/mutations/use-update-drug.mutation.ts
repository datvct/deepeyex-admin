import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { UpdateDrugResponse } from "../../types/response";
import { UpdateDrugBody } from "../../types/body";
import { DrugApi } from "../../apis/drugApi";

type Options = Omit<
  UseMutationOptions<UpdateDrugResponse, Error, UpdateDrugBody & { drug_id: string }>,
  "mutationFn"
>;

function useUpdateDrugMutation(options?: Options) {
  return useMutation({
    mutationFn: async (body: UpdateDrugBody & { drug_id: string }): Promise<UpdateDrugResponse> => {
      const { drug_id, ...rest } = body;

      const form = new FormData();

      Object.entries(rest).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (key === "image") {
          const files = value as any[];
          if (Array.isArray(files) && files.length > 0) {
            const firstFile = files[0];
            if (firstFile.originFileObj) {
              form.append("image", firstFile.originFileObj);
            }
          }
        } else {
          form.append(key, value as string);
        }
      });

      return DrugApi.update(drug_id, form);
    },
    ...options,
  });
}

export { useUpdateDrugMutation };
