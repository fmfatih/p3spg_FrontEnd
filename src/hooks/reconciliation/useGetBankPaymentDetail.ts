import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useQuery, useMutation } from "react-query";
import { QueryKeys } from "../queryKeys";
import { BasePagingResponse, BaseResponse } from "../_types";

export type GetBankPaymentDetailRequest = {
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
  endOfDate?:string

};

export type GetBankPaymentDetailResponse = BasePagingResponse<Array<any>>;

async function getBankPaymentDetail(   
  data: GetBankPaymentDetailRequest
): Promise<any> {
  try {
    return (await axiosInstance.post("/Reconciliation/BankSettlementDetails", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetBankPaymentDetail() {
  return useMutation<GetBankPaymentDetailResponse, Error, GetBankPaymentDetailRequest>((variables) =>
    getBankPaymentDetail(variables)
  );
}

