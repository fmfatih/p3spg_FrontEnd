import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useQuery, useMutation } from "react-query";
import { QueryKeys } from "../queryKeys";
import { BaseResponse } from "../_types";

export type RefundPaymentAndTransactionRequest = {
  merchantId: number;
  orderId: string;
  description: string;
  refundAmount: number;
};

export type RefundPaymentAndTransactionResponse = BaseResponse<Array<any>>;

async function refundPaymentAndTransaction(
  data: RefundPaymentAndTransactionRequest
): Promise<any> {
  try {
    return (await axiosInstance.post("/Payment/Refund", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useRefundPaymentAndTransaction() {
  return useMutation<any, Error, RefundPaymentAndTransactionRequest>(
    (variables) => refundPaymentAndTransaction(variables)
  );
}
