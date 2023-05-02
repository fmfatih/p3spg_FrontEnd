import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { BaseResponse } from "../_types";
import { useMutation } from "react-query";

export type DeleteRoleRequest = {
  id: number | string;
};

export type DeleteRoleResponse = BaseResponse<any>;

async function deleteRole(data: DeleteRoleRequest): Promise<any> {
  try {
    const id1 = data.id;
    return (await axiosInstance.delete(`/Role/Delete?id=${id1}`)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useDeleteRole() {
  return useMutation<any, Error, DeleteRoleRequest>((variables) =>
    deleteRole(variables)
  );
}
