import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { BaseResponse } from "../_types";
import { axiosInstance } from "../../config/axios";

export interface IMerchantAddRequest {
  memberId?: number;
  merchantType: number;
  merchantStatusType: string;
  merchantName: string;
  parentMerchantId?: number;
  tradeName: string;
  tradeRegistrationNumber: string;
  commissionProfileCode: string;
  webSite: string;
  taxNumber: string;
  taxOfficeCode: string;
  taxOfficeName: string;
  citizenshipNumber?: string;
  mcc: string;
  foundationDate: string;
  openingDate?: string;
  aggreementDate?: string;
  closedDate?: null | string;
  phoneNumber: string;
  description: string;
  mobilePos: boolean;
  vpos: boolean;
  pos: boolean;
}

export type IMerchantAddResponse = BaseResponse<{
  merchantId: number;
}>

async function merchantAdd(
  data: IMerchantAddRequest
): Promise<IMerchantAddResponse> {
  try {
    return (await axiosInstance.post("/Merchant/add", {memberId: 0, ...data}))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useMerchantAdd() {
  return useMutation<any, Error, IMerchantAddRequest>(
    (variables) => merchantAdd(variables)
  );
}
