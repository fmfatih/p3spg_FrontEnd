import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { BasePagingResponse } from "../_types";

type GetBankListRequest = {
  page?: number;
  size?: number;
  orderByDesc?: boolean;
  orderBy?: string
  status: 'ACTIVE' | "PASSIVE"
}

export interface IBank {
  code: string;
  name: string;
  description: string;
  logo: string;
  url: string;
  id: number;
  status: "ACTIVE" | "PASSIVE";
  systemDate: string;
  createDate: string;
  createUserId: number;
  createUserName: null | string;
  updateDate: null | string;
  updateUserId: number;
  updateUserName: null | string;
  deleteDate: null | string;
  deleteUserId: number;
  deleteUserName: null | string;
}

export type IBankListWithPaginationResponse = BasePagingResponse<Array<IBank>>;

async function getBankListWithPagination({status, page= 0, size= 15, orderByDesc= true, orderBy = "CreateDate"}: GetBankListRequest): Promise<IBankListWithPaginationResponse> {
  const data = {
    status,
    page,
    size,
    orderByDesc,
    orderBy
  };
  try {
    return (await axiosInstance.post("/Bank/ListWithPagination", data))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetBankListWithPagination() {
  return useMutation<IBankListWithPaginationResponse, Error, GetBankListRequest>((data) =>
    getBankListWithPagination(data)
  );
}
