import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";



export interface IDocumentAddRequest {
  files: File[];
  dto: {
    companyType: number;
    posType: number;
    taxNumber:string;
    merchantId: number;
    idNumber: string;
    documentInfoId: number;
  }[];
}

async function documentAdd(formData: FormData): Promise<any> {
  try {
    return (await axiosInstance.post("/Document/Add", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useDocumentAdd() {
  return useMutation<any, Error, FormData>(
    (variables) => documentAdd(variables)
  );
}
