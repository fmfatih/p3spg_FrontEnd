import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IUpdateCommissionParameterRequest {
  id: number;
  profileCode: string;
  merchantId: number;
  submerchantId: number;
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
}

async function updateCommissionParameter(
  data: IUpdateCommissionParameterRequest
): Promise<any> {
  try {
    return (await axiosInstance.put("/CommissionParameter/Update", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useUpdateCommissionParameter() {
  return useMutation<any, Error, IUpdateCommissionParameterRequest>(
    (variables) => updateCommissionParameter(variables)
  );
}
