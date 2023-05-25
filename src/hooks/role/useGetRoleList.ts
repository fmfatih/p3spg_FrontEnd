import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { BasePagingResponse } from "../_types";

export type GetRoleListRequest = {
  page?: number;
  size?: number;
  orderByDesc?: boolean;
  orderBy?: string
}

export type IRole ={
  name: string;
  code: string;
  description: string;
  id: number;
  status: string;
  systemDate: string;
  createDate: string;
  createUserId: number;
  updateDate: string;
  updateUserId: number;
  deleteDate: string;
  deleteUserId: number;
  order: number; 
  userType: number; 
}

export type GetRoleListResponse = BasePagingResponse<Array<IRole>>;

async function getRoleList({page= 0, size= 15, orderByDesc= true, orderBy = "CreateDate"}: GetRoleListRequest): Promise<GetRoleListResponse> {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy
  };

  try {
    return (await axiosInstance.post("/Role/List", data))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetRoleList() {
  return useMutation<GetRoleListResponse, Error, GetRoleListRequest>((variables) =>
    getRoleList(variables)
  );
}
