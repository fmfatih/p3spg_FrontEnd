import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useQuery, useMutation } from "react-query";
import { QueryKeys } from "../queryKeys";
import { BasePagingResponse, BaseResponse } from "../_types";

export type GetMerchantPaymentDetailRequest = {
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
  date?:string;
  paymentFlag?:boolean;



};

export type GetMerchantPaymentDetailResponse = BasePagingResponse<Array<any>>;

async function getMerchantPaymentDetail(   
  data: GetMerchantPaymentDetailRequest
): Promise<any> {
  try {
    return (await axiosInstance.post("/Reconciliation/SettlementDetails", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetMerchantPaymentDetail() {
  return useMutation<GetMerchantPaymentDetailResponse, Error, GetMerchantPaymentDetailRequest>((variables) =>
    getMerchantPaymentDetail(variables)
  );
}

