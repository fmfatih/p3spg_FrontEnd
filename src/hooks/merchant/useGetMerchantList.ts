import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { BasePagingResponse } from "../_types";

export type GetMerchantListRequest = {
  page?: number;
  size?: number;
  orderByDesc?: boolean;
  orderBy?: string;
};

export type IMerchant = {
  id?: number;
  merchantId?: number;
  memberId?: number;
  merchantType: number;
  merchantStatusType: string;
  merchantName: string;
  parentMerchantId: number;
  tradeName: string;
  tradeRegistrationNumber: string;
  commissionProfileCode: string;
  webSite: string;
  taxNumber: string;
  taxOfficeCode: string;
  taxOfficeName: string;
  citizenshipNumber: string;
  mcc: string;
  foundationDate: string;
  openingDate: string;
  aggreementDate: string;
  closedDate: null | string;
  phoneNumber: string;
  description: string;
  mobilePos: boolean;
  vpos: boolean;
  pos: boolean;
  try:boolean;
  usd:boolean;
  eur:boolean;
  officialFullName:string;
  addressLine1:string;
  iban:string;
};

export type GetMerchantListResponse = BasePagingResponse<Array<any>>;

async function getMerchantList({
  page = 0,
  size = 15,
  orderByDesc = true,
  orderBy = "CreateDate",
}: GetMerchantListRequest): Promise<any> {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy,
  };
  try {
    return (await axiosInstance.post("/Merchant/List", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetMerchantList() {
  return useMutation<GetMerchantListResponse, Error, GetMerchantListRequest>(
    (variables) => getMerchantList(variables)
  );
}
