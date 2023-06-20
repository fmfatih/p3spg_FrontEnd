import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { QueryKeys } from "../queryKeys";

export type GetCommissionProfileListRequest = {
  page?: number;
  size?: number;
  orderByDesc?: boolean;
  orderBy?: string
}

async function getCommissionProfileList({page= 0, size= 15, orderByDesc= true, orderBy = "CreateDate"}: GetCommissionProfileListRequest): Promise<any> {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy
  };

  try {
    return (await axiosInstance.post("/CommissionProfile/List", data))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetCommissionProfileList(data: GetCommissionProfileListRequest) {
  return useQuery<any | undefined, Error>(
    [QueryKeys.GetCommissionProfileList, data],
    () => getCommissionProfileList(data)
  );
}
