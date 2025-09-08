import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { CreatePatientBody } from "../../types/body";
import { PatientApi } from "../../apis/patientApi";
import { CreatePatientResponse } from "../../types/response";

type Options = Omit<
  UseMutationOptions<CreatePatientResponse, Error, CreatePatientBody>,
  "mutationFn"
>;

function useCreatePatientMutation(options?: Options) {
  return useMutation({
    mutationFn: async (body: CreatePatientBody) => {
      const form = new FormData();

      Object.entries(body).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "avatar") {
            const fileList = value as any[];
            if (Array.isArray(fileList) && fileList.length > 0) {
              form.append("avatar", fileList[0].originFileObj);
            }
          } else {
            form.append(key, value as string);
          }
        }
      });

      return PatientApi.create(form);
    },
    ...options,
  });
}

export { useCreatePatientMutation };
