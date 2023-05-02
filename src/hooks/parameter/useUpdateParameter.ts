import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IUpdateSettingRequest {
  name: string;
  code: string;
  description: string;
  id: number;
}

async function updateParameter(data: IUpdateSettingRequest): Promise<any> {
  try {
    return (await axiosInstance.put("/Setting/Update", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useUpdateParameter() {
  return useMutation<any, Error, IUpdateSettingRequest>((variables) =>
    updateParameter(variables)
  );
}
