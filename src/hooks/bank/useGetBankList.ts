import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { QueryKeys } from "../queryKeys";

export type GetBankListRequest = {
  page?: number;
  size?: number;
  orderByDesc?: boolean;
  orderBy?: string
}

async function getBankList({page= 0, size= 15, orderByDesc= true, orderBy = "CreatedDate"}: GetBankListRequest): Promise<any> {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy
  };
  try {
    return (await axiosInstance.post("/Bank/List", data))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetBankList(data: GetBankListRequest) {
  return useQuery<any | undefined, Error>(
    QueryKeys.GetBankList,
    () => getBankList(data),
    { cacheTime: Infinity }
  );
}
