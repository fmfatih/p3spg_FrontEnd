import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IPaymentWithLinkedRequest {
  bankCode: string;
  orderId: string;
  merchantId: number;
  amount: string;
  installmentCount: string;
  description: string;
  currency: string;
  userEmail: string;
  userPhoneNumber: string;
  expireMinute: number;
  memberId: number;
}

async function paymentWithLinked(
  data: IPaymentWithLinkedRequest
): Promise<any> {
  try {
    return (await axiosInstance.post("/Payment/CreateLinkPayment", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function usePaymentWithLinked() {
  return useMutation<any, Error, IPaymentWithLinkedRequest>((variables) =>
    paymentWithLinked(variables)
  );
}
