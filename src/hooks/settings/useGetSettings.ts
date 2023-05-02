import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { QueryKeys } from "../queryKeys";

export enum SettingsGroupCode {
  MERCHANTTYPE = "MERCHANTTYPE",
  INSTALLMENTCOUNT = "INSTALLMENTCOUNT",
  MENUTYPE = "MENUTYPE",
  RESOURCETYPE = "RESOURCETYPE",
  TRNXSUBTYPE = "TRNXSUBTYPE",
  PAYMENT3DTXNTYPE = "PAYMENT3DTXNTYPE",
  TRNXSTATUS = "TRNXSTATUS",
  PAYMENTMODEL = "PAYMENTMODEL",
  LINKSTATUS = "LINKSTATUS",
}

export type GetSettingsListRequest = {
  page?: number;
  size?: number;
  orderByDesc?: boolean;
  orderBy?: string;
  groupCode?: SettingsGroupCode;
};

async function getSettingsList(data: GetSettingsListRequest): Promise<any> {
  try {
    if (data?.page && data?.size)
      return (await axiosInstance.post("/Setting/List", data)).data;
    else
      return (await axiosInstance.post("/Setting/ListWithoutPagination", data))
        .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetMerchantTypeSettingsList({
  page = 0,
  size = 15,
  orderByDesc = true,
  orderBy = "CreateDate",
}: GetSettingsListRequest) {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy,
    groupCode: SettingsGroupCode.MERCHANTTYPE,
  };

  return useQuery<any | undefined, Error>(
    [QueryKeys.GetSettingsMerchantType, data],
    () => getSettingsList(data)
  );
}

export function useGetInstallmentCountSettingsList({
  page = 0,
  size = 15,
  orderByDesc = true,
  orderBy = "CreateDate",
}: GetSettingsListRequest) {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy,
    groupCode: SettingsGroupCode.INSTALLMENTCOUNT,
  };

  return useQuery<any | undefined, Error>(
    [QueryKeys.GetSettingsInstallmentCount, data],
    () => getSettingsList(data)
  );
}

export function useGetMenuTypeSettingsList({
  page = 0,
  size = 15,
  orderByDesc = true,
  orderBy = "CreateDate",
}: GetSettingsListRequest) {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy,
    groupCode: SettingsGroupCode.MENUTYPE,
  };

  return useQuery<any | undefined, Error>(
    [QueryKeys.GetMenuTypeList, data],
    () => getSettingsList(data)
  );
}

export function useGetResourceTypeSettingsList({
  page = 0,
  size = 15,
  orderByDesc = true,
  orderBy = "CreateDate",
}: GetSettingsListRequest) {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy,
    groupCode: SettingsGroupCode.RESOURCETYPE,
  };

  return useQuery<any | undefined, Error>(
    [QueryKeys.GetResourceType, data],
    () => getSettingsList(data)
  );
}

export function useGetTransactionSubTypeSettingsList({
  page = 0,
  size = 15,
  orderByDesc = true,
  orderBy = "CreateDate",
}: GetSettingsListRequest) {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy,
    groupCode: SettingsGroupCode.TRNXSUBTYPE,
  };

  return useQuery<any | undefined, Error>(
    [QueryKeys.GetTransactionSubTypeList, data],
    () => getSettingsList(data)
  );
}

export function useGetPayment3DTrxSettingsList({
  page = 0,
  size = 15,
  orderByDesc = true,
  orderBy = "CreateDate",
}: GetSettingsListRequest) {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy,
    groupCode: SettingsGroupCode.PAYMENT3DTXNTYPE,
  };

  return useQuery<any | undefined, Error>(
    [QueryKeys.GetPayment3DTrxList, data],
    () => getSettingsList(data)
  );
}

export function useGetTrxStatusSettingsList({
  page = 0,
  size = 15,
  orderByDesc = true,
  orderBy = "CreateDate",
}: GetSettingsListRequest) {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy,
    groupCode: SettingsGroupCode.TRNXSTATUS,
  };

  return useQuery<any | undefined, Error>(
    [QueryKeys.GetTransactionStatusList, data],
    () => getSettingsList(data)
  );
}

export function useGetPaymentModelSettingsList({
  page = 0,
  size = 15,
  orderByDesc = true,
  orderBy = "CreateDate",
}: GetSettingsListRequest) {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy,
    groupCode: SettingsGroupCode.PAYMENTMODEL,
  };

  return useQuery<any | undefined, Error>(
    [QueryKeys.GetPaymentModelList, data],
    () => getSettingsList(data)
  );
}

export function useGetLinkedPaymentStatusList({
  page = 0,
  size = 15,
  orderByDesc = true,
  orderBy = "CreateDate",
}: GetSettingsListRequest) {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy,
    groupCode: SettingsGroupCode.LINKSTATUS,
  };

  return useQuery<any | undefined, Error>(
    [QueryKeys.GetLinkedPaymentStatusList, data],
    () => getSettingsList(data)
  );
}
