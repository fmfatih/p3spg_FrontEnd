import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IUpdateRoleRequest {
  name: string;
  code: string;
  description: string;
  id: number;
}

async function updateRole(
  data: IUpdateRoleRequest
): Promise<any> {
  try {
    return (await axiosInstance.put("/Role/Update", data))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useUpdateRole() {
  return useMutation<any, Error, IUpdateRoleRequest>(
    (variables) => updateRole(variables)
  );
}
