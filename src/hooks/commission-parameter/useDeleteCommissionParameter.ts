import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { BaseResponse } from "../_types";
import { useMutation } from "react-query";

export type DeleteCommissionParameterRequest = {
  id: number | string;
};

export type DeleteCommissionParameterResponse = BaseResponse<any>;

async function deleteCommissionParameter(
  data: DeleteCommissionParameterRequest
): Promise<any> {
  try {
    const id1 = data.id;
    return (await axiosInstance.delete(`/CommissionParameter/Delete?id=${id1}`))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useDeleteCommissionParameter() {
  return useMutation<any, Error, DeleteCommissionParameterRequest>(
    (variables) => deleteCommissionParameter(variables)
  );
}
