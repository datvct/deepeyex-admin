import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { UpdateHospitalResponse } from "../../types/response";
import { HospitalApi } from "../../apis/hospitalApi";
import { UpdateHospitalBody } from "../../types/body";

type Options = Omit<
  UseMutationOptions<UpdateHospitalResponse, Error, UpdateHospitalBody & { hospital_id: string }>,
  "mutationFn"
>;

function useUpdateHospitalMutation(options?: Options) {
  return useMutation({
    mutationFn: async (
      body: UpdateHospitalBody & { hospital_id: string },
    ): Promise<UpdateHospitalResponse> => {
      const { hospital_id, ...rest } = body;

      const form = new FormData();

      Object.entries(rest).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (key === "logo") {
          const files = value as any[];
          if (Array.isArray(files) && files.length > 0) {
            const firstFile = files[0];
            if (firstFile.originFileObj) {
              form.append("logo", firstFile.originFileObj);
            }
          }
        } else {
          form.append(key, value as string);
        }
      });

      return HospitalApi.update(hospital_id, form);
    },
    ...options,
  });
}

export { useUpdateHospitalMutation };
