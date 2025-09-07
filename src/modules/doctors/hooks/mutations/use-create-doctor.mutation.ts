import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { CreateDoctorResponse } from "../../types/response";
import { CreateDoctorBody } from "../../types/body";
import { DoctorApi } from "../../apis/doctorApi";

type Options = Omit<
  UseMutationOptions<CreateDoctorResponse, Error, CreateDoctorBody>,
  "mutationFn"
>;

function useCreateDoctorMutation(options?: Options) {
  return useMutation({
    mutationFn: (body: CreateDoctorBody) => DoctorApi.create(body),
    ...options,
  });
}

export { useCreateDoctorMutation };
