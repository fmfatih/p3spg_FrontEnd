import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IMemberVPosUpdateWithSettingsRequest {
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

async function memberVPosUpdateWithSettings(
  data: IMemberVPosUpdateWithSettingsRequest
): Promise<any> {
  try {
    return (await axiosInstance.put("/MemberVpos/UpdateWithSettings", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useMemberVPosUpdateWithSettings() {
  return useMutation<any, Error, IMemberVPosUpdateWithSettingsRequest>(
    (variables) => memberVPosUpdateWithSettings(variables)
  );
}
