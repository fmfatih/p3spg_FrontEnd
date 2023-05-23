import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { BasePagingResponse } from "../_types";

export type GetMerchantVPosListRequest = {
  page?: number;
  size?: number;
  orderByDesc?: boolean;
  orderBy?: string;
  status: "ACTIVE" | "PASSIVE";
};

export type IMerchantVPos = {
  fullName: string;
  mail: string;
  officePhone: string;
  phoneNumber: string;
  description: string;
  // memberId: number;
  merchantId: number;
  // memberName: string;
  merchantName: string;
  bankCode: number;
  bankName: string;
  defaultBank: boolean;
  id: number;
  status: "BLOCKED" | "ACTIVE" | "PASSIVE" | null;
  systemDate: string;
  createDate: string;
  createUserId: number;
  updateDate: string;
  updateUserId: number;
  deleteDate: string;
  deleteUserId: number;
  // memberVposSettings?: Array<any>;
  merchantVposSettings?: Array<any>;
};

export type IGetMerchantVPosListResponse = BasePagingResponse<Array<IMerchantVPos>>;

async function getMerchantVPosList({
  status,
  page,
  size,
  orderByDesc = true,
  orderBy = "CreateDate",
}: GetMerchantVPosListRequest): Promise<IGetMerchantVPosListResponse> {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy,
    status,
  };
  try {
    if ((page === 0 || page) && size)
      return (await axiosInstance.post("/MerchantVPos/List", data)).data;
    else
      return (
        await axiosInstance.post("/MerchantVPos/ListWithoutPagination", data)
      ).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetMerchantVPosList() {
  return useMutation<
    IGetMerchantVPosListResponse,
    Error,
    GetMerchantVPosListRequest
  >((variables) => getMerchantVPosList(variables));
}
