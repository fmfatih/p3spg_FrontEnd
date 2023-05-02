import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { BaseResponse } from "../_types";
import { useMutation } from "react-query";

export type DeleteMemberVPosRequest = {
  id: number | string;
};

export type DeleteMemberVPos = BaseResponse<any>;

async function deleteMemberVPos(data: DeleteMemberVPosRequest): Promise<any> {
  try {
    const id1 = data.id;
    return (await axiosInstance.delete(`/MemberVpos/Delete?id=${id1}`)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useMemberVPosDelete() {
  return useMutation<any, Error, DeleteMemberVPosRequest>((variables) =>
    deleteMemberVPos(variables)
  );
}
