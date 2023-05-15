import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IPaymentPreAuthRequest {
  cardNumber: string;
  expiryDateMonth: string;
  expiryDateYear: string;
  cvv: string;
  cardHolderName: string;
  merchantId: number;
  totalAmount: string;
  memberId: number;
  txnType: string;
  installmentCount: string;
  currency: string;
  orderId: string;
  use3D: boolean;
  okUrl:string;
  failUrl:string
}

async function paymentPreAuth(data: IPaymentPreAuthRequest): Promise<any> {
  try {
    return (await axiosInstance.post("/Payment/PreAuth", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function usePaymentPreAuth() {
  return useMutation<any, Error, IPaymentPreAuthRequest>((variables) =>
    paymentPreAuth(variables)
  );
}
