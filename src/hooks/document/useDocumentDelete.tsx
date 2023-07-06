import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { BaseResponse } from "../_types";
import { useMutation } from "react-query";

export type DeleteDocumentRequest = {
  id: number | string;
};

export type DeleteDocumentResponse = BaseResponse<any>;

async function deleteDocument(data: DeleteDocumentRequest): Promise<any> {
  try {
    const id1 = data.id;
    return (await axiosInstance.delete(`/Document/Delete?id=${id1}`)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useDocumentDelete() {
  return useMutation<any, Error, DeleteDocumentRequest>((variables) =>
    deleteDocument(variables)
  );
}
