import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { QueryKeys } from "../queryKeys";

export type GetIssuerBankListRequest = {
  page?: number;
  size?: number;
  orderByDesc?: boolean;
  orderBy?: string;
};

async function getIssuerBankList(): Promise<any> {
  try {
    return (await axiosInstance.get("/AcqBin/IssuerBanks")).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetIssuerBankList() {
  return useQuery<any | undefined, Error>(
    QueryKeys.GetIssuerBankList,
    () => getIssuerBankList(),
    { cacheTime: Infinity }
  );
}
