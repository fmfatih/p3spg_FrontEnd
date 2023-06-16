import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IUpdateCommissionProfileRequest {
  id: number;
  name: string;
  code: string;
  description: string;
  // profileCode: string;
  // merchantId: number;
  // submerchantId: number;
  // txnType: string;
  // onus: boolean;
  // commissionFlag:boolean;
  // international: boolean;
  // amex: boolean;
  // installment: number;
  // bankcode: string;
  // bankblocked: boolean;
  // bankblockedday: number;
  // bankcommission: number;
  // merchantblocked: boolean;
  // merchantblockedday: number;
  // merchantcommission: number;
  // merchantadditionalcommission: number;
  // // customercommission: number;
  // // customeradditionalcommission: number;
}

async function updateCommissionProfile(
  data: IUpdateCommissionProfileRequest
): Promise<any> {
  try {
    return (await axiosInstance.put("/CommissionProfile/Update", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useUpdateCommissionProfile() {
  return useMutation<any, Error, IUpdateCommissionProfileRequest>(
    (variables) => updateCommissionProfile(variables)
  );
}
