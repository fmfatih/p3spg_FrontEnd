import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { BaseResponse } from "../_types";
import { axiosInstance } from "../../config/axios";

interface IValidateOtpRequest {
  otpCode: string;
}

type IValidateOtpResponse = BaseResponse<any>;

async function validateOtp(
  data: IValidateOtpRequest
): Promise<IValidateOtpResponse> {
  try {
    return (await axiosInstance.post("/Auth/VerifyLoginOtp", data))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useValidateOtp() {
  return useMutation<IValidateOtpResponse, Error, IValidateOtpRequest>(
    (variables) => validateOtp(variables)
  );
}
