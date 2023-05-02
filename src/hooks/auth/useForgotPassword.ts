import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { BaseResponse } from "../_types";
import { axiosInstance } from "../../config/axios";

export interface IForgotPasswordRequest {
  email: string;
  phoneNumber: string;
}

export type IForgotPasswordResponse = BaseResponse<any>;

async function forgotPassword(
  data: IForgotPasswordRequest
): Promise<IForgotPasswordResponse> {
  try {
    return (await axiosInstance.post("/Auth/ForgotPassword", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useForgotPassword() {
  return useMutation<IForgotPasswordResponse, Error, IForgotPasswordRequest>(
    (variables) => forgotPassword(variables)
  );
}
