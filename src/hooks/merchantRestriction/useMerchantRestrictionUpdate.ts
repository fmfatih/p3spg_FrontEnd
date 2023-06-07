import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IMerchantRestrictionUpdateRequest   {
  id?: number;
  merchantId?: number;
  try: boolean,
  eur: boolean,
  usd: boolean

}

async function merchantRestrictionUpdate(
  data: IMerchantRestrictionUpdateRequest 
): Promise<any> {
  try {
    return (
      await axiosInstance.put("/MerchantRestriction/Update", { ...data })
    ).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useMerchantRestrictionUpdate() {
  return useMutation<any, Error, IMerchantRestrictionUpdateRequest >((variables) =>
    merchantRestrictionUpdate(variables)
  );
}
