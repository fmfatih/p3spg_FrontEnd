import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IMerchantBankUpdateRequest {
  id?: number;
  merchantId?: number;
  currencyCode: number;
  bankCode: string;
  iban: string;
  accountOwner: string;
}

async function merchantBankUpdate(
  data: IMerchantBankUpdateRequest
): Promise<any> {
  try {
    return (
      await axiosInstance.put("/MerchantBank/Update", { bankType: 1, ...data })
    ).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useMerchantBankUpdate() {
  return useMutation<any, Error, IMerchantBankUpdateRequest>((variables) =>
    merchantBankUpdate(variables)
  );
}
