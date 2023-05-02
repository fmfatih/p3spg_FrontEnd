import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { BasePagingResponse } from "../_types";

export type GetNonsecureListRequest = {
  page?: number;
  size?: number;
  orderByDesc?: boolean;
  orderBy?: string;
};

export type INonsecure = {
  merchantId: number;
  merchantName?: string;
  bankCode: string;
  bankName?: string;
  threeDRequired: boolean;
  maxAmount: number;
  id?: number;
};

export type GetNonsecureListResponse = BasePagingResponse<Array<INonsecure>>;

async function getNonsecureList({
  page = 0,
  size = 15,
  orderByDesc = true,
  orderBy = "CreateDate",
}: GetNonsecureListRequest): Promise<GetNonsecureListResponse> {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy,
  };

  try {
    return (await axiosInstance.post("/MerchantThreeDSetting/List", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetNonsecureList() {
  return useMutation<GetNonsecureListResponse, Error, GetNonsecureListRequest>((variables) =>
    getNonsecureList(variables)
  );
}
