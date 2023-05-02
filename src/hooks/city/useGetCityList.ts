
import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { QueryKeys } from "../queryKeys";

export type GetCityListRequest = {
  page?: number;
  size?: number;
  orderByDesc?: boolean;
  orderBy?: string
}

async function getCityList({page= 0, size= 15, orderByDesc= true, orderBy = "CreatedDate"}: GetCityListRequest): Promise<any> {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy
  };

  try {
    return (await axiosInstance.post("/City/List", data))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetCityList(data: GetCityListRequest) {
  return useQuery<any | undefined, Error>(
    [QueryKeys.GetCityList, data],
    () => getCityList(data)
  );
}
