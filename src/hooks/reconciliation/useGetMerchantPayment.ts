import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useQuery, useMutation } from "react-query";
import { QueryKeys } from "../queryKeys";
import { BasePagingResponse, BaseResponse } from "../_types";

export type GetMerchantPaymentRequest = {
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
  merchantId?:number;
  paymentFlag?:boolean;
  date?:string

};

export type GetMerchantPaymentResponse = BasePagingResponse<Array<any>>;

async function getMerchantPayment(   
  data: GetMerchantPaymentRequest
): Promise<any> {
  try {
    return (await axiosInstance.post("/Reconciliation/ListSettlement", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetMerchantPayment() {
  return useMutation<GetMerchantPaymentResponse, Error, GetMerchantPaymentRequest>((variables) =>
    getMerchantPayment(variables)
  );
}

