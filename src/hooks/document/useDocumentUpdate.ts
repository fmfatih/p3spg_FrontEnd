import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IDocumentUpdateRequest {
  id: number;
  formData: FormData;
}

async function documentUpdate(data: IDocumentUpdateRequest): Promise<any> {
  try {
    return (await axiosInstance.put(`/Document/Update?id=${data.id}`, data.formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}


export function useDocumentUpdate() {
  return useMutation<any, Error, IDocumentUpdateRequest>(
    (variables) => documentUpdate(variables)
  );
}