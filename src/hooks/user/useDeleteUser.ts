import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { BaseResponse } from "../_types";
import { useMutation } from "react-query";

export type DeleteUserRequest = {
  id: number | string;
};

export type DeleteUserResponse = BaseResponse<any>;

async function deleteUser(data: DeleteUserRequest): Promise<any> {
  try {
    const id1 = data.id;
    return (await axiosInstance.delete(`/User/Delete?id=${id1}`)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useDeleteUser() {
  return useMutation<any, Error, DeleteUserRequest>((variables) =>
    deleteUser(variables)
  );
}
