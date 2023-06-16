import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { BasePagingResponse } from "../_types";

export interface ICommissionProfileForPage {
 id:number,
 name:string,
 code:string,
 description: string
}

export type GetCommissionProfileListForPageResponse = BasePagingResponse<
  Array<ICommissionProfileForPage>
>;

export type  GetCommissionProfileListForPageRequest = {
  page: number;
  size: number;
  orderByDesc: boolean;
  orderBy: string;
  status:string;
  [key: string]: string | number | boolean | undefined;
};

async function getCommissionProfileListForPage(
  data: GetCommissionProfileListForPageRequest
): Promise<GetCommissionProfileListForPageResponse> {
  try {
    return (await axiosInstance.post("/CommissionProfile/List", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetCommissionProfileListForPage() {
  return useMutation<
  GetCommissionProfileListForPageResponse,
  Error,
  GetCommissionProfileListForPageRequest
  >((variables) => getCommissionProfileListForPage(variables))}