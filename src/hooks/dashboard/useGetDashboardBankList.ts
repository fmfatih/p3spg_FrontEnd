import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { GetDashboardTransactionListRequest, GetDashboardTransactionListResponse } from "./useGetDashboardTransactionList";


async function getDashboardBankList({
  period,
}: GetDashboardTransactionListRequest): Promise<GetDashboardTransactionListResponse> {
  try {
    return (
      await axiosInstance.get(
        `/Dashboard/BankTransactions?period=${period}&txnType=AUTH`
      )
    ).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetDashboardBankList() {
  return useMutation<
    GetDashboardTransactionListResponse,
    Error,
    GetDashboardTransactionListRequest
  >((param) => getDashboardBankList(param));
}
