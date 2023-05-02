import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IAddParameterRequest {
  name: string;
  code: string;
  description: string;
}

async function addParameter(data: IAddParameterRequest): Promise<any> {
  try {
    return (await axiosInstance.post("/Setting/Add", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useAddParameter() {
  return useMutation<any, Error, IAddParameterRequest>((variables) =>
    addParameter(variables)
  );
}
