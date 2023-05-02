import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IVPosRoutingRequest {
  memberId: number;
  merchantId: number;
  issuerCardBankCodes?: Array<string>;
  issuerCardType: string;
  merchantVposBankCode: string;
  transactionSubType: string;
  onusRouting: boolean;
}

async function addVPosRouting(data: IVPosRoutingRequest): Promise<any> {
  try {
    return (await axiosInstance.post("/VposRouting/Add", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useAddVPosRouting() {
  return useMutation<any, Error, IVPosRoutingRequest>((variables) =>
    addVPosRouting(variables)
  );
}
