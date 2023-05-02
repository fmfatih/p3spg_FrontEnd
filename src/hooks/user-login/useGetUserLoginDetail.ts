import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { QueryKeys } from "../queryKeys";

export type GetUserLoginDetailRequest = {
  id: number | string;
}

async function getUserLoginDetail({id}: GetUserLoginDetailRequest): Promise<any> {
  try {
    return (await axiosInstance.get(`/UserLogin/Get?id=${id}`))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetUserLoginDetail({id}: GetUserLoginDetailRequest) {
  return useQuery<any | undefined, Error>(
    QueryKeys.GetUserLoginDetail,
    () => getUserLoginDetail({id})
  );
}
