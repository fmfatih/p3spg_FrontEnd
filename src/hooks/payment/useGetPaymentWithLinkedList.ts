import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";
import { BasePagingResponse } from "../_types";

export interface IPaymentWithLinkedListRequest {
  page?: number;
  size?: number;
  orderByDesc?: boolean;
  orderBy?: string;
  merchantID?: number;
  status?: string;
} 

export interface IPaymentWithLinkedListItem {
  merchantId:	number;
  merchantName:	string;
  linkCreatedDate:	string;
  linkExpiredDate:	string;
  status:	string;
  orderId:	string;
}

export type IPaymentWithLinkedListResponse = BasePagingResponse<Array<IPaymentWithLinkedListItem>>;

async function paymentWithLinkedList(
  data: IPaymentWithLinkedListRequest
): Promise<IPaymentWithLinkedListResponse> {
  try {
    return (await axiosInstance.post("/Transaction/GetCreatedLinks", data))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetPaymentWithLinkedList() {
  return useMutation<IPaymentWithLinkedListResponse, Error, IPaymentWithLinkedListRequest>((variables) =>
    paymentWithLinkedList(variables)
  );
}
