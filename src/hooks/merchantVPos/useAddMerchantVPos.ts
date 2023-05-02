import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IMerchantVPosAddRequest {
  merchantId?: number;
  bankCodes?: Array<string>;
}

async function addMerchantVPos(
  data: IMerchantVPosAddRequest
): Promise<any> {
  try {
    return (await axiosInstance.post("/MerchantVpos/Add", data))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useAddMerchantVPos() {
  return useMutation<any, Error, IMerchantVPosAddRequest>(
    (variables) => addMerchantVPos(variables)
  );
}
