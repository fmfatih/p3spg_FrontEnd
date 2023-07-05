import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";
import { QueryKeys } from "../queryKeys";

export type GetDocumentGetListByIdRequest = {
  id: number | string;
};

export type GetMerchantVposGetListByIdResponse = any;

async function getDocumentGetListById(data: GetDocumentGetListByIdRequest): Promise<any> {
  try {
    const id1 = data.id;
    return (
      await axiosInstance.get(`/MerchantVpos/GetListById?merchantId=${id1}`)
    ).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetDocumentGetListById() {
  return useMutation<any, Error, GetDocumentGetListByIdRequest>((variables) =>
  getDocumentGetListById(variables)
  );
}
