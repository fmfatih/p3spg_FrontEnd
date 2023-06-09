import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { BasePagingResponse } from "../_types";

export type GetParameterListRequest = {
  page?: number;
  size?: number;
  orderByDesc?: boolean;
  orderBy?: string;
  [key: string]: string | number | boolean | undefined;
};

export type IParameter = {
  groupCode: string;
  key: string;
  value: string;
  id: number;
  status: string;
  systemDate: string;
  createDate: string;
  createUserId: number;
  updateDate: string;
  updateUserId: number;
  deleteDate: string;
  deleteUserId: number;
};

// export type GetParameterListResponse = BasePagingResponse<Array<IParameter>>;

// async function getParameterList({
//   page = 0,
//   size = 15,
//   orderByDesc = true,
//   orderBy = "CreateDate",
// }: GetParameterListRequest): Promise<GetParameterListResponse> {
//   const data = {
//     page,
//     size,
//     orderByDesc,
//     orderBy,
//   };

//   try {
//     return (await axiosInstance.post("/Setting/List", data)).data;
//   } catch (ex) {
//     throw ((ex as AxiosError).response?.data as any).error;
//   }
// }

export type GetParameterListResponse = BasePagingResponse<Array<IParameter>>;

async function getParameterList(
  data: GetParameterListRequest
): Promise<GetParameterListResponse> {
  try {
    if ((data.page === 0 || data.page) && data.size)
      return (await axiosInstance.post("/Setting/List", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
  return {} as GetParameterListResponse; 
}


export function useGetParameterList() {
  return useMutation<GetParameterListResponse, Error, GetParameterListRequest>((variables) =>
  getParameterList(variables)
  );
}
