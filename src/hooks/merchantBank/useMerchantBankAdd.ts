import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IMerchantBankAddRequest {
  merchantId?: number;
  currencyCode: number;
  bankCode: string;
  iban: string;
  accountOwner: string;
}

async function merchantBankAdd(
  data: IMerchantBankAddRequest
): Promise<any> {
  try {
    return (await axiosInstance.post("/MerchantBank/add", { ...data}))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useMerchantBankAdd() {
  return useMutation<any, Error, IMerchantBankAddRequest>(
    (variables) => merchantBankAdd(variables)
  );
}
// bankType: 1