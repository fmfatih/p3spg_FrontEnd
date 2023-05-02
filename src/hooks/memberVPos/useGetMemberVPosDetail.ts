import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { QueryKeys } from "../queryKeys";

export type GetMemberVPosDetailRequest = {
  id: number | string;
}

async function getMemberVPosDetail({id}: GetMemberVPosDetailRequest): Promise<any> {
  try {
    return (await axiosInstance.get(`/UserLogin/Get?id=${id}`))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetMemberVPosDetail({id}: GetMemberVPosDetailRequest) {
  return useQuery<any | undefined, Error>(
    QueryKeys.GetUserLoginDetail,
    () => getMemberVPosDetail({id})
  );
}
