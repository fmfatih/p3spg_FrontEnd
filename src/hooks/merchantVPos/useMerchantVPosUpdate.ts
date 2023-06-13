import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IMerchantVPosUpdateRequest {
  id: number;
  // memberId: number;
  merchantId: number;
  bankCodes: string[];
  defaultBank : boolean;
  status : "ACTIVE" | "PASSIVE" | "BLOCKED"
}

async function merchantVPosUpdate(
  data: IMerchantVPosUpdateRequest
): Promise<any> {
  try {
    return (await axiosInstance.put("/MerchantVpos/Update", data))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useMerchantVPosUpdate() {
  return useMutation<any, Error, IMerchantVPosUpdateRequest>(
    (variables) => merchantVPosUpdate(variables)
  );
}
