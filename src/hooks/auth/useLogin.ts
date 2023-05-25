import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { BaseResponse } from "../_types";
import { axiosInstance } from "../../config/axios";

interface ILoginRequest {
  email: string;
  password: string;
}

export type ILoginResponse = BaseResponse<{
  expireDate: Date;
  fullName: string;
  phoneNumber: string;
  sessionId: string;
  token: string;
  tokenType: string;
  merchantId: string;
  merchantName: string;
  systemPassword?: boolean;
  order: number;
}>;

async function login(data: ILoginRequest): Promise<ILoginResponse> {
  try {
    return (await axiosInstance.post("/auth/login", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useLogin() {
  return useMutation<ILoginResponse, Error, ILoginRequest>((variables) =>
    login(variables)
  );
}
