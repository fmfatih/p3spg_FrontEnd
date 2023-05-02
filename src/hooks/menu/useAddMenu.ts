import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IAddMenuRequest {
  name: string;
  menuCode?: string;
  menuType: number;
  order: number;
  parentId: number;
  description: string;
  media?: string;
  url: string;
  feId?: string;
  feType: string;
  exactMatch: boolean;
}

async function addMenu(data: IAddMenuRequest): Promise<any> {
  try {
    return (await axiosInstance.post("/Menu/Add", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useAddMenu() {
  return useMutation<any, Error, IAddMenuRequest>((variables) =>
    addMenu(variables)
  );
}
