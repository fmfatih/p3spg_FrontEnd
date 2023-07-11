import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";



export interface ICommissionFilesUploadRequest {
  files: File[];
}

async function commissionFilesUpload(formData: FormData): Promise<any> {
  try {
    return (await axiosInstance.post("/CommissionParameter/AddFromFile", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useAddCommissionParameterFiles() {
  return useMutation<any, Error, FormData>(
    (variables) => commissionFilesUpload(variables)
  );
}
