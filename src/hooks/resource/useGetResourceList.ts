import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { BasePagingResponse } from "../_types";

export type GetResourceListRequest = {
  page?: number;
  size?: number;
  orderByDesc?: boolean;
  orderBy?: string
  [key: string]: string | number | boolean | undefined;
}

export type IResource  = {
  key: string;
  value: string;
  language: string;
  resourceType: number;
  resourceTypeName: string;
  id: number;
  status: string;
  systemDate: string;
  createDate: string;
  createUserId: number;
  updateDate: string | undefined;
  updateUserId: number;
  deleteDate: string | undefined;
  deleteUserId: number;
}
export type GetResourceListResponse = BasePagingResponse<Array<IResource>>

// async function getResourceList({page= 0, size= 15, orderByDesc= true, orderBy = "CreateDate"}: GetResourceListRequest): Promise<GetResourceListResponse> {
//   const data = {
//     page,
//     size,
//     orderByDesc,
//     orderBy
//   };

//   try {
//     return (await axiosInstance.post("/Resource/List", data))
//       .data;
//   } catch (ex) {
//     throw ((ex as AxiosError).response?.data as any).error;
//   }
// }

async function getResourceList(
  data: GetResourceListRequest
): Promise<GetResourceListResponse> {
  try {
    return (await axiosInstance.post("/Resource/List", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}


export function useGetResourceList() {
  return useMutation<GetResourceListResponse, Error, GetResourceListRequest>((variables) =>
  getResourceList(variables)
  );
}
