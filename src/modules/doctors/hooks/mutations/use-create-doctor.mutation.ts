import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { CreateDoctorResponse } from "../../types/response";
import { CreateDoctorBody } from "../../schemas/createDoctor.schema";
import { DoctorApi } from "../../apis/doctorApi";

type Options = Omit<
  UseMutationOptions<CreateDoctorResponse, Error, CreateDoctorBody>,
  "mutationFn"
>;

function useCreateDoctorMutation(options?: Options) {
  return useMutation({
    mutationFn: async (body: CreateDoctorBody) => {
      const form = new FormData();

      Object.entries(body).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "avatar") {
            const files = value as any[];
            if (files.length > 0 && files[0].originFileObj) {
              form.append("avatar", files[0].originFileObj);
            }
          } else {
            form.append(key, value as string);
          }
        }
      });
      return DoctorApi.create(form);
    },
    ...options,
  });
}

export { useCreateDoctorMutation };
