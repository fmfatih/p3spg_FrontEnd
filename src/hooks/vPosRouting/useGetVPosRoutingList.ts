import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { BasePagingResponse } from "../_types";

export type GetVPosRoutingListRequest = {
  page?: number;
  size?: number;
  orderByDesc?: boolean;
  orderBy?: string;
};

export type IVPosRouting = {
  memberId: number;
  merchantId: number;
  issuerCardBankCodes: Array<string>;
  issuerCardBankName: string;
  issuerCardType: string;
  merchantVposBankCode: string;
  merchantVposBankName: string;
  id: number;
  status: string;
  transactionSubType?: string;
  systemDate: string;
  createDate: string;
  createUserId: number;
  updateDate: string | null;
  updateUserId: number;
  deleteDate: string | null;
  deleteUserId: number;
};

export type GetVPosRoutingListResponse = BasePagingResponse<
  Array<IVPosRouting>
>;

async function getVPosRoutingList({
  page = 0,
  size = 15,
  orderByDesc = true,
  orderBy = "CreateDate",
}: GetVPosRoutingListRequest): Promise<GetVPosRoutingListResponse> {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy,
  };
  try {
    return (await axiosInstance.post("/VPosRouting/List", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetVPosRoutingList() {
  return useMutation<
    GetVPosRoutingListResponse,
    Error,
    GetVPosRoutingListRequest
  >((variables) => getVPosRoutingList(variables));
}
