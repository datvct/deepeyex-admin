import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { UpdateDoctorResponse } from "../../types/response";
import { UpdateDoctorBody } from "../../types/body";
import { DoctorApi } from "../../apis/doctorApi";

type Options = Omit<
  UseMutationOptions<UpdateDoctorResponse, Error, UpdateDoctorBody & { doctor_id: string }>,
  "mutationFn"
>;

function useUpdateDoctorMutation(options?: Options) {
  return useMutation({
    mutationFn: async (
      body: UpdateDoctorBody & { doctor_id: string },
    ): Promise<UpdateDoctorResponse> => {
      const { doctor_id, ...rest } = body;

      const form = new FormData();

      Object.entries(rest).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (key === "avatar") {
          const files = value as any[];
          if (Array.isArray(files) && files.length > 0) {
            const firstFile = files[0];
            if (firstFile.originFileObj) {
              form.append("avatar", firstFile.originFileObj);
            }
          }
        } else {
          form.append(key, value as string);
        }
      });

      return DoctorApi.update(doctor_id, form);
    },
    ...options,
  });
}

export { useUpdateDoctorMutation };
