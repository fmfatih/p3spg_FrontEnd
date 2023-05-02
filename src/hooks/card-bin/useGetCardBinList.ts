import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { QueryKeys } from "../queryKeys";

export type GetCardBinListRequest = {
  page?: number;
  size?: number;
  orderByDesc?: boolean;
  orderBy?: string
}

async function getCardBin({page= 0, size= 15, orderByDesc= true, orderBy = "CreatedDate"}: GetCardBinListRequest): Promise<any> {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy
  };
  try {
    return (await axiosInstance.post("/CardBin/List", data))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetCardBinList(data: GetCardBinListRequest) {
  return useQuery<any | undefined, Error>(
    QueryKeys.GetCardBinList,
    () => getCardBin(data),
    { cacheTime: Infinity }
  );
}
