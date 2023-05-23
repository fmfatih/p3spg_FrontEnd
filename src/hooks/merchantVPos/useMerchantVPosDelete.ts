import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { BaseResponse } from "../_types";
import { useMutation } from "react-query";

export type DeleteMerchantVPosRequest = {
  id: number | string;
};

export type DeleteMerchantVPos = BaseResponse<any>;

async function deleteMerchantVPos(data: DeleteMerchantVPosRequest): Promise<any> {
  try {
    const id1 = data.id;
    return (await axiosInstance.delete(`/MerchantVpos/Delete?id=${id1}`)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useMerchantVPosDelete() {
  return useMutation<any, Error, DeleteMerchantVPosRequest>((variables) =>
    deleteMerchantVPos(variables)
  );
}
