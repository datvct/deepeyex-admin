import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { UploadFileResponse } from "../../types/response";
import { UploadApi } from "../../apis/uploadApi";

type UploadFileOptions = Omit<
  UseMutationOptions<UploadFileResponse, AxiosError, File>,
  "mutationFn"
>;

function useUploadFileMutation(options?: UploadFileOptions) {
  return useMutation<UploadFileResponse, AxiosError, File>({
    mutationFn: (file) => UploadApi.uploadFile(file),
    ...options,
  });
}

export { useUploadFileMutation };
