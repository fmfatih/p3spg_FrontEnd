import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IAddResourceRequest {
  key: string;
  value: string;
  language: string;
  resourceType: number;
  externalErrorCode: string;
}

async function addResource(
  data: IAddResourceRequest
): Promise<any> {
  try {
    return (await axiosInstance.post("/Resource/Add", data))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useAddResource() {
  return useMutation<any, Error, IAddResourceRequest>(
    (variables) => addResource(variables)
  );
}
