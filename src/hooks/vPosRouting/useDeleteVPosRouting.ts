import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { BaseResponse } from "../_types";
import { useMutation } from "react-query";

export type DeleteVPosRoutingRequest = {
  id: number | string;
};

export type DeleteVPosRoutingResponse = BaseResponse<any>;

async function deleteVPosRouting(data: DeleteVPosRoutingRequest): Promise<any> {
  try {
    const id1 = data.id;
    return (await axiosInstance.delete(`/VposRouting/Delete?id=${id1}`)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useDeleteVPosRouting() {
  return useMutation<any, Error, DeleteVPosRoutingRequest>((variables) =>
    deleteVPosRouting(variables)
  );
}
