import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IUpdateNonsecureRequest {
  merchantId: number;
  bankCode: string;
  threeDRequired: boolean;
  maxAmount: number;
  id: number;
}

async function updateNonsecure(data: IUpdateNonsecureRequest): Promise<any> {
  try {
    return (await axiosInstance.put("/MerchantThreeDSetting/Update", data))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useUpdateNonsecure() {
  return useMutation<any, Error, IUpdateNonsecureRequest>((variables) =>
    updateNonsecure(variables)
  );
}
