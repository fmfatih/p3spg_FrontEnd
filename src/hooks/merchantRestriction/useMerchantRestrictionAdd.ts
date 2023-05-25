import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface   IMerchantRestrictionRequest { 

  merchantId?: number;
  try: boolean,
  eur: boolean,
  usd: boolean
}

async function merchantRestrictionAdd(
  data:   IMerchantRestrictionRequest
): Promise<any> {
  try {
    return (await axiosInstance.post("/MerchantRestriction/add", {...data}))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useMerchantRestrictionAdd() {
  return useMutation<any, Error,   IMerchantRestrictionRequest>(
    (variables) => merchantRestrictionAdd(variables)
  );
}
