import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { BaseResponse } from "../_types";
import { useMutation } from "react-query";

export type DeleteParameterRequest = {
  id: number | string;
};

export type DeleteParameterResponse = BaseResponse<any>;

async function deleteParameter(data: DeleteParameterRequest): Promise<any> {
  try {
    const id1 = data.id;
    return (await axiosInstance.delete(`/Setting/Delete?id=${id1}`)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useDeleteParameter() {
  return useMutation<any, Error, DeleteParameterRequest>((variables) =>
    deleteParameter(variables)
  );
}
