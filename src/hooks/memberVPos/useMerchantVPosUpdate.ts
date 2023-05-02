import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IMemberVPosUpdateRequest {
  id: number;
  memberId: number;
  bankCode: string;
  defaultBank : boolean;
  status : "ACTIVE" | "PASSIVE" | "BLOCKED"
}

async function memberVPosUpdate(
  data: IMemberVPosUpdateRequest
): Promise<any> {
  try {
    return (await axiosInstance.put("/MemberVpos/Update", data))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useMemberVPosUpdate() {
  return useMutation<any, Error, IMemberVPosUpdateRequest>(
    (variables) => memberVPosUpdate(variables)
  );
}
