import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IVPosRoutingUpdateRequest {
  memberId: number;
  merchantId: number;
  issuerCardBankCodes?: Array<string>;
  issuerCardType: string;
  merchantVposBankCode: string;
  transactionSubType: string;
  id: number;
  onusRouting: boolean;
  profileCode: string;
}

async function vPosRoutingUpdate(
  data: IVPosRoutingUpdateRequest
): Promise<any> {
  try {
    return (await axiosInstance.put("/VPosRouting/Update", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useUpdateVPosRouting() {
  return useMutation<any, Error, IVPosRoutingUpdateRequest>((variables) =>
    vPosRoutingUpdate(variables)
  );
}
