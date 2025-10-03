import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { TimeSlotApi } from "../../apis/timeSlotApi";

type ImportDayOffResponse = { message: string };

type Options = Omit<UseMutationOptions<ImportDayOffResponse, Error, File>, "mutationFn">;

const useImportDayOffMutation = (options?: Options) => {
  return useMutation({
    mutationFn: (file: File) => TimeSlotApi.importDayOff(file),
    ...options,
  });
};

export { useImportDayOffMutation };
