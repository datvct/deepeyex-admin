import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { CreateHospitalResponse } from "../../types/response";
import { HospitalApi } from "../../apis/hospitalApi";
import { CreateHospitalBody } from "../../types/body";

type Options = Omit<
  UseMutationOptions<CreateHospitalResponse, Error, CreateHospitalBody>,
  "mutationFn"
>;

function useCreateHospitalMutation(options?: Options) {
  return useMutation({
    mutationFn: async (body: CreateHospitalBody) => {
      const form = new FormData();

      Object.entries(body).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "logo") {
            const files = value as any[]; // value là array
            if (files.length > 0 && files[0].originFileObj) {
              form.append("logo", files[0].originFileObj);
            }
          } else {
            form.append(key, value as string);
          }
        }
      });
      return HospitalApi.create(form);
    },
    ...options,
  });
}

export { useCreateHospitalMutation };
