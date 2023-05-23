import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { QueryKeys } from "../queryKeys";

export type GetMerchantVPosDetailRequest = {
  id: number | string;
}

async function getMerchantVPosDetail({id}: GetMerchantVPosDetailRequest): Promise<any> {
  try {
    return (await axiosInstance.get(`/UserLogin/Get?id=${id}`))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetMerchantVPosDetail({id}: GetMerchantVPosDetailRequest) {
  return useQuery<any | undefined, Error>(
    QueryKeys.GetUserLoginDetail,
    () => getMerchantVPosDetail({id})
  );
}
