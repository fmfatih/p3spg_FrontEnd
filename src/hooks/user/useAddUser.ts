import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IUserAddRequest {
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  userType: number;
  roleIds: Array<number>;
  merchantId: number;
}

async function userAdd(data: IUserAddRequest): Promise<any> {
  try {
    return (await axiosInstance.post("/User/Add", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useUserAdd() {
  return useMutation<any, Error, IUserAddRequest>((variables) =>
    userAdd(variables)
  );
}
