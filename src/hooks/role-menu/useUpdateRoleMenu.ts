import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IUpdateRoleMenuRequest {
  id: number;
  roleId: number;
  menuIds: [number];
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

async function updateRoleMenu(data: IUpdateRoleMenuRequest): Promise<any> {
  try {
    return (await axiosInstance.put("/RoleMenu/Update", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useUpdateRoleMenu() {
  return useMutation<any, Error, IUpdateRoleMenuRequest>((variables) =>
    updateRoleMenu(variables)
  );
}
