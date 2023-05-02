import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";
import { BaseResponse } from "../_types";

export interface IPassiveLinkedPaymentRequest {
  orderId: string;
}

export interface IPaymentWithLinkedListItem {}

export type IPassiveLinkedPaymentResponse = BaseResponse<Array<any>>;

async function passiveLinkedPayment(
  data: IPassiveLinkedPaymentRequest
): Promise<any> {
  try {
    return (await axiosInstance.post("/Payment/PassiveLinkPayment", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function usePassiveLinkedPayment() {
  return useMutation<any, Error, IPassiveLinkedPaymentRequest>((variables) =>
    passiveLinkedPayment(variables)
  );
}
