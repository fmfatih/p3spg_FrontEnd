import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { BaseResponse } from "../_types";
import { useMutation } from "react-query";

export type DeleteMenuRequest = {
  id: number | string;
};

export type DeleteMenuResponse = BaseResponse<any>;

async function deleteMenu(data: DeleteMenuRequest): Promise<any> {
  try {
    const id1 = data.id;
    return (await axiosInstance.delete(`/Menu/Delete?id=${id1}`)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useDeleteMenu() {
  return useMutation<any, Error, DeleteMenuRequest>((variables) =>
    deleteMenu(variables)
  );
}
