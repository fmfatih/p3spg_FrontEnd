import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { QueryKeys } from "../queryKeys";

export enum GroupCode {
  USER = "USER",
  USERTYPE = "USERTYPE",
  MERCHANTTYPE = "MERCHANTTYPE",
  POSTYPE = "POSTYPE",
  CURRENCYCODE = "CURRENCYCODE",
  MERCHANTSTATUS = "MERCHANTSTATUS",
  CARDTYPE = "CARDTYPE",
}

export type GetStatusTypeListRequest = {
  page?: number;
  size?: number;
  orderByDesc?: boolean;
  orderBy?: string;
  groupCode?: GroupCode;
};

async function getStatusTypeList(data: GetStatusTypeListRequest): Promise<any> {
  try {
    return (await axiosInstance.post("/StatusType/List", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetMerchantTypeList({
  page = 0,
  size = 15,
  orderByDesc = true,
  orderBy = "CreateDate",
}: GetStatusTypeListRequest) {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy,
    groupCode: GroupCode.MERCHANTTYPE,
  };

  return useQuery<any | undefined, Error>(
    [QueryKeys.GetMerchantType, data],
    () => getStatusTypeList(data)
  );
}

export function useGetPosTypeList({
  page = 0,
  size = 15,
  orderByDesc = true,
  orderBy = "CreateDate",
}: GetStatusTypeListRequest) {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy,
    groupCode: GroupCode.POSTYPE,
  };

  return useQuery<any | undefined, Error>([QueryKeys.GetPosType, data], () =>
    getStatusTypeList(data)
  );
}

export function useGetCurrencyCodeList({
  page = 0,
  size = 15,
  orderByDesc = true,
  orderBy = "CreateDate",
}: GetStatusTypeListRequest) {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy,
    groupCode: GroupCode.CURRENCYCODE,
  };

  return useQuery<any | undefined, Error>(
    [QueryKeys.GetCurrencyCode, data],
    () => getStatusTypeList(data)
  );
}

export function useGetMerchantStatusList({
  page = 0,
  size = 15,
  orderByDesc = true,
  orderBy = "CreateDate",
}: GetStatusTypeListRequest) {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy,
    groupCode: GroupCode.MERCHANTSTATUS,
  };

  return useQuery<any | undefined, Error>(
    [QueryKeys.GetMerchantStatusList, data],
    () => getStatusTypeList(data)
  );
}

export function useGetUserTypeList({
  page = 0,
  size = 15,
  orderByDesc = true,
  orderBy = "CreateDate",
}: GetStatusTypeListRequest) {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy,
    groupCode: GroupCode.USERTYPE,
  };

  return useQuery<any | undefined, Error>(
    [QueryKeys.GetUserTypeList, data],
    () => getStatusTypeList(data)
  );
}

export function useGetCardTypeList({
  page = 0,
  size = 15,
  orderByDesc = true,
  orderBy = "CreateDate",
}: GetStatusTypeListRequest) {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy,
    groupCode: GroupCode.CARDTYPE,
  };

  return useQuery<any | undefined, Error>([QueryKeys.GetCardType, data], () =>
    getStatusTypeList(data)
  );
}
