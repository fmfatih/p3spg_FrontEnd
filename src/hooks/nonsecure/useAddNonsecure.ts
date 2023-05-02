import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IAddNonSecureRequest {
  merchantId: number;
  bankCode: string;
  threeDRequired: boolean;
  maxAmount: number;
}

async function addNonsecure(data: IAddNonSecureRequest): Promise<any> {
  try {
    return (await axiosInstance.post("/MerchantThreeDSetting/Add", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useAddNonsecure() {
  return useMutation<any, Error, IAddNonSecureRequest>((variables) =>
    addNonsecure(variables)
  );
}
