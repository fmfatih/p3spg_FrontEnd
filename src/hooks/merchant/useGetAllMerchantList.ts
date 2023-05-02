import { useQuery } from "react-query";
import { AxiosError } from "axios";
import { BaseResponse } from "../_types";
import { axiosInstance } from "../../config/axios";
import { QueryKeys } from "../queryKeys";

interface IGetAllMerchantListRequest {}

type IGetAllMerchantListResponse = BaseResponse<any>;

async function getAllMerchantList(): Promise<IGetAllMerchantListResponse> {
  try {
    return (await axiosInstance.get("/Merchant/All")).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetAllMerchantList() {
  return useQuery<any | undefined, Error>([QueryKeys.GetAllMerchantList], () =>
    getAllMerchantList()
  );
}
