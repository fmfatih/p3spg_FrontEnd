import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IUserUpdateRequest {
  id: number;
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  systemPassword: boolean;
  memberId: number;
  userType: number;
  roleIds: Array<number>;
  merchantId: number;
}

async function userUpdate(data: IUserUpdateRequest): Promise<any> {
  try {
    return (await axiosInstance.put("/User/Update", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useUpdateUser() {
  return useMutation<any, Error, IUserUpdateRequest>((variables) =>
    userUpdate(variables)
  );
}
