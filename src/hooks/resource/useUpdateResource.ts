import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IUpdateResourceRequest {
  key: string;
  value: string;
  language: string;
  resourceType: number;
  externalErrorCode?: string;
  id: number;
}

async function updateResource(
  data: IUpdateResourceRequest
): Promise<any> {
  try {
    return (await axiosInstance.put("/Resource/Update", data))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useUpdateResource() {
  return useMutation<any, Error, IUpdateResourceRequest>(
    (variables) => updateResource(variables)
  );
}
