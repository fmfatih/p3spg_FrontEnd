import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IDocumentUpdateRequest {
  id: number;
  fileName: string;
  merchantId: number;
  taxNumber: string;
}

async function documentUpdate(updateRequest: IDocumentUpdateRequest): Promise<any> {
  try {
    return (await axiosInstance.put("/Document/Update", updateRequest)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useDocumentUpdate() {
  return useMutation<any, Error, IDocumentUpdateRequest>(
    (variables) => documentUpdate(variables)
  );
}
