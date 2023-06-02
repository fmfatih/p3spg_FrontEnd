import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IMerchantPartnerUpdateRequest {
  id?: number;
  merchantId?: number;
  partnerOneFullName?: string;
  partnerOneCitizenNumber?: string;
  partnerOneMobilePhone?: string;
  partnerTwoFullName?: string;
  partnerTwoCitizenNumber?: string;
  partnerTwoMobilePhone?: string;
}

async function merchantPartnerUpdate(
  data: IMerchantPartnerUpdateRequest
): Promise<any> {
  try {
    return (await axiosInstance.put("/MerchantPartner/Update", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useMerchantPartnerUpdate() {
  return useMutation<any, Error, IMerchantPartnerUpdateRequest>((variables) =>
    merchantPartnerUpdate(variables)
  );
}
