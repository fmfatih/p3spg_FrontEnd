import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IChangePasswordRequest {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

async function changePassword(data: IChangePasswordRequest): Promise<any> {
  try {
    return (await axiosInstance.post("/User/ChangePassword", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useChangePassword() {
  return useMutation<any, Error, IChangePasswordRequest>((variables) =>
    changePassword(variables)
  );
}
