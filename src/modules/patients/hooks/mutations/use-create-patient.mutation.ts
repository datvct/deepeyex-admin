import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { CreatePatientBody } from "../../types/body";
import { PatientApi } from "../../apis/patientApi";
import { CreatePatientResponse } from "../../types/response";

type Options = Omit<
  UseMutationOptions<
    CreatePatientResponse,
    Error,
    CreatePatientBody
  >,
  "mutationFn"
>;

function useCreatePatientMutation(options?: Options) {
  return useMutation({
    mutationFn: (body: CreatePatientBody) => PatientApi.create(body),
    ...options,
  });
}

export { useCreatePatientMutation };
