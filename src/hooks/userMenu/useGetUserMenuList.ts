import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { QueryKeys } from "../queryKeys";
import { BaseResponse } from "../_types";

export enum IMenuTypes {
  collapsable = "collapsable",
  basic = "basic",
}

export type IUserMenu = {
  id: string;
  title: string;
  type: IMenuTypes;
  icon: string;
  link: string;
  order: number;
  childs?: Array<IUserMenu>;
}

export type GetUserMenuListResponse = BaseResponse<Array<IUserMenu>>

async function getUserMenuList(): Promise<GetUserMenuListResponse> {
  try {
    return (await axiosInstance.get(`/UserMenu/GetUserMenus`))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetUserMenuList() {
  return useQuery<GetUserMenuListResponse | undefined, Error>(
    QueryKeys.GetUserMenuList,
    () => getUserMenuList()
  );
}
