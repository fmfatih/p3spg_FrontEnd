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
}

async function paymentSales(data: IPaymentPreAuthRequest): Promise<any> {
  try {
    return (await axiosInstance.post("/Payment/Auth", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function usePaymentSales() {
  return useMutation<any, Error, IPaymentPreAuthRequest>((variables) =>
    paymentSales(variables)
  );
}
