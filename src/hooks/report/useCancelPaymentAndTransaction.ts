import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useQuery, useMutation } from "react-query";
import { QueryKeys } from "../queryKeys";
import { BaseResponse } from "../_types";

export type CancelPaymentAndTransactionRequest = {
  merchantId: number;
  orderId: string;
  description: string;
};

export type CancelPaymentAndTransactionResponse = BaseResponse<Array<any>>;

async function cancelPaymentAndTransaction(
  data: CancelPaymentAndTransactionRequest
): Promise<any> {
  try {
    return (await axiosInstance.post("/Payment/Void", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useCancelPaymentAndTransaction() {
  return useMutation<any, Error, CancelPaymentAndTransactionRequest>(
    (variables) => cancelPaymentAndTransaction(variables)
  );
}
