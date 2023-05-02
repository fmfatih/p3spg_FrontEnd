import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IAddCommissionProfileRequest {
  name: string;
  code: string;
  description: string;
}

async function addCommissionProfile(
  data: IAddCommissionProfileRequest
): Promise<any> {
  try {
    return (await axiosInstance.post("/CommissionProfile/Add", data))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useAddCommissionProfile() {
  return useMutation<any, Error, IAddCommissionProfileRequest>(
    (variables) => addCommissionProfile(variables)
  );
}
