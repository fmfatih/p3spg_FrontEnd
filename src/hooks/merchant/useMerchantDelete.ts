import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { BaseResponse } from "../_types";
import { useMutation } from "react-query";

export type DeleteMerchantRequest = {
  id: number | string;
};

export type DeleteMerchantResponse = BaseResponse<any>;

async function deleteMerchant(data: DeleteMerchantRequest): Promise<any> {
  try {
    const id1 = data.id;
    return (await axiosInstance.delete(`/Merchant/Delete?id=${id1}`)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useMerchantDelete() {
  return useMutation<any, Error, DeleteMerchantRequest>((variables) =>
    deleteMerchant(variables)
  );
}
