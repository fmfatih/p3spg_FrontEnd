import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";
import { QueryKeys } from "../queryKeys";

export type GetDocumentListRequest = {
  id: number | string;
};

export type GetDocumentListResponse = any;

async function getDocumentList(data: GetDocumentListRequest): Promise<any> {
  try {
    const id1 = data.id;
    return (await axiosInstance.get(`/Document/List?id=${id1}`)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetDocumentList() {
  return useMutation<any, Error, GetDocumentListRequest>((variables) =>
    getDocumentList(variables)
  );
}
