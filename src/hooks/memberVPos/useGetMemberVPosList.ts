import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { BasePagingResponse } from "../_types";

export type GetMemberVPosListRequest = {
  page?: number;
  size?: number;
  orderByDesc?: boolean;
  orderBy?: string;
  status: "ACTIVE" | "PASSIVE";
};

export type IMemberVPos = {
  fullName: string;
  mail: string;
  officePhone: string;
  phoneNumber: string;
  description: string;
  memberId: number;
  memberName: string;
  bankCode: number;
  bankName: string;
  defaultBank: boolean;
  id: number;
  status: "BLOCKED" | "ACTIVE" | "PASSIVE" | null;
  systemDate: string;
  createDate: string;
  createUserId: number;
  updateDate: string;
  updateUserId: number;
  deleteDate: string;
  deleteUserId: number;
  memberVposSettings?: Array<any>;
};

export type IGetMemberVPosListResponse = BasePagingResponse<Array<IMemberVPos>>;

async function getMemberVPosList({
  status,
  page,
  size,
  orderByDesc = true,
  orderBy = "CreateDate",
}: GetMemberVPosListRequest): Promise<IGetMemberVPosListResponse> {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy,
    status,
  };
  try {
    if ((page === 0 || page) && size)
      return (await axiosInstance.post("/MemberVPos/List", data)).data;
    else
      return (
        await axiosInstance.post("/MemberVPos/ListWithoutPagination", data)
      ).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetMemberVPosList() {
  return useMutation<
    IGetMemberVPosListResponse,
    Error,
    GetMemberVPosListRequest
  >((variables) => getMemberVPosList(variables));
}
