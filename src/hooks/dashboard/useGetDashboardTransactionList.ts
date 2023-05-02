import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { BaseResponse } from "../_types";

export type GetDashboardTransactionListRequest = {
  period: 'YEARLY' | 'MONTHLY' | 'WEEKLY' | 'DAILY';
};

export type IDashboardTransaction = {
  key: string;
  value: string;
  description: string;
  bankCode?: string;
};

export type GetDashboardTransactionListResponse = BaseResponse<Array<IDashboardTransaction>>;

async function getDashboardTransactionList({
  period
}: GetDashboardTransactionListRequest): Promise<GetDashboardTransactionListResponse> {
  
  try {
    return (await axiosInstance.get(`/Dashboard/Transactions?period=${period}`)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetDashboardTransactionList() {
  return useMutation<GetDashboardTransactionListResponse, Error, GetDashboardTransactionListRequest>(
    (param) => getDashboardTransactionList(param)
  );
}
