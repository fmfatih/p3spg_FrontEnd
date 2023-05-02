import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { BaseResponse } from "../_types";
import { useMutation } from "react-query";

export type DeleteNonsecureRequest = {
  id: number | string;
};

export type DeleteParameterResponse = BaseResponse<any>;

async function deleteNonsecure(data: DeleteNonsecureRequest): Promise<any> {
  try {
    const id1 = data.id;
    return (
      await axiosInstance.delete(`/MerchantThreeDSetting/Delete?id=${id1}`)
    ).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useDeleteNonsecure() {
  return useMutation<any, Error, DeleteNonsecureRequest>((variables) =>
    deleteNonsecure(variables)
  );
}
