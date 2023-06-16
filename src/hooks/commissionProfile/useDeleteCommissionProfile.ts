import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { BaseResponse } from "../_types";
import { useMutation } from "react-query";

export type DeleteCommissionProfileRequest = {
  id: number | string;
};

export type DeleteCommissionParameterResponse = BaseResponse<any>;

async function deleteCommissionProfile(
  data: DeleteCommissionProfileRequest
): Promise<any> {
  try {
    const id1 = data.id;
    return (await axiosInstance.delete(`/CommissionProfile/Delete?id=${id1}`))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useDeleteCommissionProfile() {
  return useMutation<any, Error, DeleteCommissionProfileRequest>(
    (variables) => deleteCommissionProfile(variables)
  );
}
