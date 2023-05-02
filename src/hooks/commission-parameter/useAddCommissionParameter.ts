import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IAddCommissionParameterRequest {
  profileCode: string;
  merchantId: number;
  submerchantId: number;
  txnType: string;
  onus: boolean;
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
  customercommission: number;
  customeradditionalcommission: number;
}

async function addCommissionParameter(
  data: IAddCommissionParameterRequest
): Promise<any> {
  try {
    return (await axiosInstance.post("/CommissionParameter/Add", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useAddCommissionParameter() {
  return useMutation<any, Error, IAddCommissionParameterRequest>((variables) =>
    addCommissionParameter(variables)
  );
}
