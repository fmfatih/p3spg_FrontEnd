import { useQuery } from "react-query";
import { AxiosError } from "axios";
import { BaseResponse } from "../_types";
import { axiosInstance } from "../../config/axios";
import { QueryKeys } from "../queryKeys";

interface IGetAllRoleListRequest {}

type IGetAllRoleListResponse = BaseResponse<any>;

async function getAllRoleList(): Promise<IGetAllRoleListResponse> {
  try {
    return (await axiosInstance.get("/Role/All")).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetAllRoleList() {
  return useQuery<any | undefined, Error>([QueryKeys.GetAllRoleList], () =>
    getAllRoleList()
  );
}
