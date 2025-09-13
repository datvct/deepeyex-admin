import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { UpdatePatientResponse } from "../../types/response";
import { UpdatePatientBody } from "../../types/body";
import { PatientApi } from "../../apis/patientApi";

type Options = Omit<
  UseMutationOptions<UpdatePatientResponse, Error, UpdatePatientBody & { patient_id: string }>,
  "mutationFn"
>;

function useUpdatePatientMutation(options?: Options) {
  return useMutation({
    mutationFn: async (
      body: UpdatePatientBody & { patient_id: string },
    ): Promise<UpdatePatientResponse> => {
      const { patient_id, ...rest } = body;

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

      return PatientApi.update(patient_id, form);
    },
    ...options,
  });
}

export { useUpdatePatientMutation };
