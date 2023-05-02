import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { BaseResponse } from "../_types";
import { useMutation } from "react-query";

export type DeleteRoleMenuRequest = {
  id: number | string;
};

export type DeleteRoleMenuResponse = BaseResponse<any>;

async function deleteRoleMenu(data: DeleteRoleMenuRequest): Promise<any> {
  try {
    const id1 = data.id;
    return (await axiosInstance.delete(`/RoleMenu/Delete?id=${id1}`)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useDeleteRoleMenu() {
  return useMutation<any, Error, DeleteRoleMenuRequest>((variables) =>
    deleteRoleMenu(variables)
  );
}
