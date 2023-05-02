import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { BasePagingResponse } from "../_types";

export type GetRoleMenuListRequest = {
  page?: number;
  size?: number;
  orderByDesc?: boolean;
  orderBy?: string;
};

export type IRoleMenu = {
  id: number;
  roleId: number;
  menuIds: [number];
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  status: string | null;
  systemDate: string;
  createDate: string;
  createUserId: number;
  updateDate: null | string;
  updateUserId: number;
  deleteDate: null | string;
  deleteUserId: number;
};

export type GetRoleMenuListResponse = BasePagingResponse<Array<IRoleMenu>>;

async function getRoleMenuList({
  page = 0,
  size = 15,
  orderByDesc = true,
  orderBy = "CreateDate",
}: GetRoleMenuListRequest): Promise<GetRoleMenuListResponse> {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy,
  };

  try {
    return (await axiosInstance.post("/RoleMenu/List", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetRoleMenuList() {
  return useMutation<GetRoleMenuListResponse, Error, GetRoleMenuListRequest>(
    (variables) => getRoleMenuList(variables)
  );
}
