import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";
import { QueryKeys } from "../queryKeys";

export type GetDocumentGetByIdRequest = {
  id: number | string;
};

export type GetDocumentGetByIdResponse = any;

async function getDocumentGetById(data: GetDocumentGetByIdRequest): Promise<any> {
  try {
    const id1 = data.id;
    return (
      await axiosInstance.get(`/Document/Get?id=${id1}`)
    ).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetDocumentGetById() {
  return useMutation<any, Error, GetDocumentGetByIdRequest>((variables) =>
  getDocumentGetById(variables)
  );
}
