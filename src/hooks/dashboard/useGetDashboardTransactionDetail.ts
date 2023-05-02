import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { BaseResponse } from "../_types";
import { IDashboardTransaction } from "./useGetDashboardTransactionList";

export type GetDashboardTransactionDetailRequest = {
  period: "YEARLY" | "MONTHLY" | "WEEKLY" | "DAILY";
  bankCode: string;
};

export type GetDashboardTransactionDetailResponse = BaseResponse<
  Array<IDashboardTransaction>
>;

async function getDashboardTransactionDetail({
  period,
  bankCode,
}: GetDashboardTransactionDetailRequest): Promise<GetDashboardTransactionDetailResponse> {
  try {
    return (
      await axiosInstance.get(
        `/Dashboard/BankTransactionDetails?period=${period}&bankCode=${bankCode}`
      )
    ).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetDashboardTransactionDetail() {
  return useMutation<
    GetDashboardTransactionDetailResponse,
    Error,
    GetDashboardTransactionDetailRequest
  >((param) => getDashboardTransactionDetail(param));
}
