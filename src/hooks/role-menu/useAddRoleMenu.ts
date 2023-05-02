import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IAddRoleMenuRequest {
  roleId: number;
  menuIds: [number];
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

async function addRoleMenu(data: IAddRoleMenuRequest): Promise<any> {
  try {
    return (await axiosInstance.post("/RoleMenu/Add", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useAddRoleMenu() {
  return useMutation<any, Error, IAddRoleMenuRequest>((variables) =>
    addRoleMenu(variables)
  );
}
