import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { BasePagingResponse } from "../_types";

export interface ICommissionParameter {
  id: number;
  profileCode: string;
  merchantId: number;
  merchantName: string;
  submerchantId: number;
  submerchantName: string;
  txnType: string;
  onus: boolean;
  commissionFlag:boolean;
  international: boolean;
  amex: boolean;
  installment: number;
  bankcode: string;
  bankblocked: boolean;
  bankblockedday: number;
  bankcommission: number;
  merchantblocked: boolean;
  merchantblockedday: number;
  merchantcommission: number;
  merchantadditionalcommission: number;
  // customercommission: number;
  // customeradditionalcommission: number;
  minAmount: number;
  maxAmount: number;
  cardType: string;
}

export type GetCommissionParameterListResponse = BasePagingResponse<
  Array<ICommissionParameter>
>;

export type GetCommissionParameterListRequest = {
  page: number;
  size: number;
  orderByDesc: boolean;
  orderBy: string;
};

async function getCommissionParameterList(
  data: GetCommissionParameterListRequest
): Promise<GetCommissionParameterListResponse> {
  try {
    return (await axiosInstance.post("/CommissionParameter/List", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetCommissionParameterList() {
  return useMutation<
    GetCommissionParameterListResponse,
    Error,
    GetCommissionParameterListRequest
  >((variables) => getCommissionParameterList(variables));
}
