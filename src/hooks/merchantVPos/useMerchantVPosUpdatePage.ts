import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IMerchantVPosUpdatePageRequest {
  id: number;
  // memberId: number;
  merchantId: number;
  bankCodes: string;
  defaultBank : boolean;
  status : "ACTIVE" | "PASSIVE" | "BLOCKED"
}

async function merchantVPosUpdatePage(
  data: IMerchantVPosUpdatePageRequest
): Promise<any> {
  try {
    return (await axiosInstance.put("/MerchantVpos/UpdateBanksStatus", data))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useMerchantVPosUpdatePage() {
  return useMutation<any, Error, IMerchantVPosUpdatePageRequest>(
    (variables) => merchantVPosUpdatePage(variables)
  );
}
