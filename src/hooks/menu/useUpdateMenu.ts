import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IUpdateMenuRequest {
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
  id: number;
}

async function updateMenu(
  data: IUpdateMenuRequest
): Promise<any> {
  try {
    return (await axiosInstance.put("/Menu/Update", data))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useUpdateMenu() {
  return useMutation<any, Error, IUpdateMenuRequest>(
    (variables) => updateMenu(variables)
  );
}
