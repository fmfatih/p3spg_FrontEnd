import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { BasePagingResponse } from "../_types";

export type GetMenuListRequest = {
  page?: number;
  size?: number;
  orderByDesc?: boolean;
  orderBy?: string;
}

export type IMenu = {
  name: string;
  menuCode: string;
  menuType: number;
  order: number;
  parentId: number;
  description: string;
  media: string;
  url: string;
  feId: string;
  feType: string;
  exactMatch: boolean;
  id: number;
  status: string;
  systemDate: string;
  createDate: string;
  createUserId: number;
  updateDate: string;
  updateUserId: number;
  deleteDate?: string;
  deleteUserId: number;
}

export type GetMenuListResponse = BasePagingResponse<Array<IMenu>>;

async function getMenuList(data: GetMenuListRequest): Promise<GetMenuListResponse> {
  try {
    return (await axiosInstance.post("/Menu/List", data))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetMenuList() {
  return useMutation<GetMenuListResponse, Error, GetMenuListRequest>((variables) =>
    getMenuList(variables)
);
}
