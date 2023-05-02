import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { QueryKeys } from "../queryKeys";

export type GetMerchantCategoryListRequest = {
  page?: number;
  size?: number;
  orderByDesc?: boolean;
  orderBy?: string
}

async function getMerchantCategoryList({page= 0, size= 15, orderByDesc= true, orderBy = "CreatedDate"}: GetMerchantCategoryListRequest): Promise<any> {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy
  };

  try {
    return (await axiosInstance.post("/MerchantCategoryCode/List", data))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetMerchantCategoryList(data: GetMerchantCategoryListRequest) {
  return useQuery<any | undefined, Error>(
    [QueryKeys.GetMerchantCategoryList, data],
    () => getMerchantCategoryList(data)
  );
}
