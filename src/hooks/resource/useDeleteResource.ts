import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { BaseResponse } from "../_types";
import { useMutation } from "react-query";

export type DeleteResourceRequest = {
  id: number | string;
};

export type DeleteResourceResponse = BaseResponse<any>;

async function deleteResource(data: DeleteResourceRequest): Promise<any> {
  try {
    const id1 = data.id;
    return (await axiosInstance.delete(`/Resource/Delete?id=${id1}`)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useDeleteResource() {
  return useMutation<any, Error, DeleteResourceRequest>((variables) =>
    deleteResource(variables)
  );
}
