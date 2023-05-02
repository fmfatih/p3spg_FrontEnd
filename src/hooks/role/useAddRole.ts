import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IAddRoleRequest {
  name: string;
  code: string;
  description: string;
}

async function addRole(data: IAddRoleRequest): Promise<any> {
  try {
    return (await axiosInstance.post("/Role/Add", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useAddRole() {
  return useMutation<any, Error, IAddRoleRequest>((variables) =>
    addRole(variables)
  );
}
