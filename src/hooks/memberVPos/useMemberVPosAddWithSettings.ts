import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IMemberVPosAddWithSettingsRequest {
  fullName: string;
  mail: string;
  officePhone: string;
  phoneNumber: string;
  description?: string;
  memberId: number;
  bankCode: string;
  defaultBank: boolean;
  parameters: Array<any>;
  merchantID?: number;
}

async function memberVPosAddWithSettings(
  data: IMemberVPosAddWithSettingsRequest
): Promise<any> {
  try {
    return (await axiosInstance.post("/MemberVpos/AddWithSettings", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useMemberVPosAddWithSettings() {
  return useMutation<any, Error, IMemberVPosAddWithSettingsRequest>(
    (variables) => memberVPosAddWithSettings(variables)
  );
}
