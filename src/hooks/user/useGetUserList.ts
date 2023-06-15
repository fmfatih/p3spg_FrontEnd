import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";
import { QueryKeys } from "../queryKeys";
import { BasePagingResponse, BaseResponse } from "../_types";

export interface IUser {
  fullName: string;
  name: string;
  surname: string;
  username: string;
  email: string;
  phoneNumber: string;
  hashPassword: string;
  password: string | null;
  tryCount: number;
  systemPassword: boolean;
  memberId: number;
  merchantId: number;
  merchantName?: string;
  userType: string;
  id: number;
  status: "BLOCKED" | "ACTIVE" | "PASSIVE" | null;
  systemDate: string;
  createDate: string;
  createUserId: number;
  updateDate: string;
  updateUserId: number;
  deleteDate: string | null;
  deleteUserId: number;
  roles: [
    {
      key: number;
      value: string;
      description: string;
    }
  ];
}

export type GetUserListResponse = BasePagingResponse<Array<IUser>>;

export type GetUserListRequest = {
  page: number;
  size: number;
  orderByDesc: boolean;
  orderBy: string;
  [key: string]: string | number | boolean | undefined;
};

async function getUserList(
  data: GetUserListRequest
): Promise<GetUserListResponse> {
  try {
    return (await axiosInstance.post("/user/list", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetUserList() {
  return useMutation<GetUserListResponse, Error, GetUserListRequest>(
    (variables) => getUserList(variables)
  );
}
