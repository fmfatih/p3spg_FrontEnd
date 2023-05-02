import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useMutation } from "react-query";

export type GetDistrictListRequest = {
  page?: number;
  size?: number;
  orderByDesc?: boolean;
  orderBy?: string
  cityCode: string;
}

async function getDistrictList({cityCode, page= 0, size= 15, orderByDesc= true, orderBy = "CreatedDate"}: GetDistrictListRequest): Promise<any> {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy,
    cityCode,
  };

  try {
    return (await axiosInstance.post("/District/List", data))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetDistrictList() {
  return useMutation<any, Error, GetDistrictListRequest>(
    (variables) => getDistrictList(variables)
  );
}