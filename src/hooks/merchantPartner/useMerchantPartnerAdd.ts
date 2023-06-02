import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IMerchantPartnerAddRequest {
  merchantId?: number;
  officialFullName?: string;
  officialCitizenNumber?: string;
  officialMobilePhone?: string;

  partnerOneFullName?: string;
  partnerOneCitizenNumber?: string;
  partnerOneMobilePhone?: string;

  partnerTwoFullName?: string;
partnerTwoCitizenNumber?: string;
partnerTwoMobilePhone?: string;

partnerThreeFullName?: string;
partnerThreeCitizenNumber?: string;
partnerThreeMobilePhone?: string;

partnerFourFullName?: string;
partnerFourCitizenNumber?: string;
partnerFourMobilePhone?: string;

partnerFiveFullName?: string;
partnerFiveCitizenNumber?: string;
partnerFiveMobilePhone?: string;
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
