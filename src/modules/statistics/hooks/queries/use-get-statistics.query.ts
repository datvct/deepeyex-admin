// src/modules/statistics/hooks/queries/use-get-statistics.query.ts
import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { QueryKeyEnum } from "../../../../shares/enums/queryKey";
import { StatisticsResponse } from "../../types/statistics";
import { StatisticsApi } from "../../apis/statisticsApi";

export interface UseGetStatisticsQueryParams {
  startDate?: string;
  endDate?: string;
  options?: Omit<
    UseQueryOptions<StatisticsResponse, Error, StatisticsResponse, QueryKey>,
    "queryKey" | "queryFn"
  >;
}

export const useGetStatisticsQuery = ({
  startDate,
  endDate,
  options,
}: UseGetStatisticsQueryParams = {}) => {
  const params = startDate && endDate ? { start_date: startDate, end_date: endDate } : undefined;

  return useQuery({
    queryKey: [QueryKeyEnum.Statistics, params],
    queryFn: () => StatisticsApi.getAll(params),
    ...options,
  });
};
