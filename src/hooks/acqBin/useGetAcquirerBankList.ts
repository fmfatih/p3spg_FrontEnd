import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { QueryKeys } from "../queryKeys";

export type GetAcquirerBankListRequest = {
  page?: number;
  size?: number;
  orderByDesc?: boolean;
  orderBy?: string;
};

async function getAcquirerBankList(): Promise<any> {
  try {
    return (await axiosInstance.get("/AcqBin/AcquirerBanks")).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetAcquirerBankList() {
  return useQuery<any | undefined, Error>(
    QueryKeys.GetAcquirerBankList,
    () => getAcquirerBankList(),
    { cacheTime: Infinity }
  );
}
