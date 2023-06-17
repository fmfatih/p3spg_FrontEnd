import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useQuery, useMutation } from "react-query";
import { QueryKeys } from "../queryKeys";
import { BasePagingResponse, BaseResponse } from "../_types";

export type GetPaymentAndTransactionRequest = {
  page?: number;
  size?: number;
  orderByDesc?: boolean;
  orderBy?: string;
  startDate?: string;
  endDate?: string;
  orderId?: string;
  cardNumber?: string;
  authCode?: string;
  status?: string;
  transactionType?: string;
  bankCode?: string;
  txnType?: string;
  merchantId?:number
};

export type GetPaymentAndTransactionResponse = BasePagingResponse<Array<any>>;

async function getPaymentAndTransaction(
  data: GetPaymentAndTransactionRequest
): Promise<any> {
  try {
    return (await axiosInstance.post("/Transaction/List", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetPaymentAndTransaction() {
  return useMutation<GetPaymentAndTransactionResponse, Error, GetPaymentAndTransactionRequest>((variables) =>
    getPaymentAndTransaction(variables)
  );
}
