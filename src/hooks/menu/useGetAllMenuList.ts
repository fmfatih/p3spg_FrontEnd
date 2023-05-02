import { useQuery } from "react-query";
import { AxiosError } from "axios";
import { BaseResponse } from "../_types";
import { axiosInstance } from "../../config/axios";
import { QueryKeys } from "../queryKeys";

interface IGetAllMenuListRequest {}

type IGetAllMenuListResponse = BaseResponse<any>;

async function getAllMenuList(): Promise<IGetAllMenuListResponse> {
  try {
    return (await axiosInstance.get("/Menu/All")).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetAllMenuList() {
  return useQuery<any | undefined, Error>([QueryKeys.GetAllMenuList], () =>
    getAllMenuList()
  );
}
