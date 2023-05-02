import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { QueryKeys } from "../queryKeys";



export type GetUserRoleListRequest = {
  page?: number;
  size?: number;
  orderByDesc?: boolean;
  orderBy?: string
}

async function getUserRoleList({page= 0, size= 15, orderByDesc= true, orderBy = "CreatedDate"}: GetUserRoleListRequest): Promise<any> {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy
  };
  try {
    return (await axiosInstance.post("/UserRole/List", data))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetUserRoleList(data: GetUserRoleListRequest) {
  return useQuery<any | undefined, Error>(
    [QueryKeys.GetUserRoleList, data],
    () => getUserRoleList(data)
  );
}
