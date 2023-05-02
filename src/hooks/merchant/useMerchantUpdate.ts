import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { BaseResponse } from "../_types";
import { axiosInstance } from "../../config/axios";

export interface IMerchantUpdateRequest {
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
  id: number;
}

export type IMerchantUpdateResponse = BaseResponse<{
  merchantId?: number;
}>;

async function merchantUpdate(
  data: IMerchantUpdateRequest
): Promise<IMerchantUpdateResponse> {
  try {
    return (
      await axiosInstance.put("/Merchant/update", { memberId: 0, ...data })
    ).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useMerchantUpdate() {
  return useMutation<any, Error, IMerchantUpdateRequest>((variables) =>
    merchantUpdate(variables)
  );
}
