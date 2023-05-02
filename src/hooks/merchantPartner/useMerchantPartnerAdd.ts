import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IMerchantPartnerAddRequest {
  merchantId?: number;
  partnerOneFullName?: string;
  partnerOneCitizenNumber?: string;
  partnerOneMobilePhone?: string;
  partnerTwoFullName?: string;
  partnerTwoCitizenNumber?: string;
  partnerTwoMobilePhone?: string;
}

async function merchantPartnerAdd(
  data: IMerchantPartnerAddRequest
): Promise<any> {
  try {
    return (await axiosInstance.post("/MerchantPartner/add", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useMerchantPartnerAdd() {
  return useMutation<any, Error, IMerchantPartnerAddRequest>((variables) =>
    merchantPartnerAdd(variables)
  );
}
