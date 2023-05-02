import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { QueryKeys } from "../queryKeys";
import { IUser } from "./useGetUserList";
import { BaseResponse } from "../_types";

export type GetUserDetailRequest = {
  id: number | string;
}

export type GetUserDetailResponse = BaseResponse<IUser>

async function getUserDetail({id}: GetUserDetailRequest): Promise<GetUserDetailResponse> {
  try {
    return (await axiosInstance.get(`/User/Get?id=${id}`))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetUserDetail({id}: GetUserDetailRequest) {
  return useQuery<GetUserDetailResponse | undefined, Error>(
    QueryKeys.GetUserDetail,
    () => getUserDetail({id})
  );
}
