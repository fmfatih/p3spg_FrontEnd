import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { BaseResponse } from "../_types";
import { axiosInstance } from "../../config/axios";

interface IReSendOtpRequest {}

type IReSendOtpResponse = BaseResponse<any>;

async function reSendOtp(data: IReSendOtpRequest): Promise<IReSendOtpResponse> {
  try {
    return (await axiosInstance.get("/Auth/ResendOtp")).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useReSendOtp() {
  return useMutation<IReSendOtpResponse, Error, IReSendOtpRequest>(
    (variables) => reSendOtp(variables)
  );
}
