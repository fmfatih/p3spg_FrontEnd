import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IMerchantVPosAddWithSettingsRequest {
  fullName: string;
  mail: string;
  officePhone: string;
  phoneNumber: string;
  description?: string;
  // memberId: number;
  merchantId: number;
  bankCode: string;
  defaultBank: boolean;
  parameters: Array<any>;
  merchantID?: number;
}

async function merchantVPosAddWithSettings(
  data: IMerchantVPosAddWithSettingsRequest
): Promise<any> {
  try {
    return (await axiosInstance.post("/MerchantVpos/AddWithSettings", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useMerchantVPosAddWithSettings() {
  return useMutation<any, Error, IMerchantVPosAddWithSettingsRequest>(
    (variables) => merchantVPosAddWithSettings(variables)
  );
}
