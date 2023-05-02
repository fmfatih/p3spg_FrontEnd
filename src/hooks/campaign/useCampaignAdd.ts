import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { BaseResponse } from "../_types";
import { axiosInstance } from "../../config/axios";

export interface ICampaignAddRequest {
  merchantId: number;
  cardBins: Array<string>;
  bankCode: string;
  cardType: string;
  discountRate: number;
  minAmount: number;
  maxAmount: number;
  startDate: string;
  endDate: string;
}

export type ICampaignAddResponse = BaseResponse<{}>;

async function campaignAdd(data: ICampaignAddRequest): Promise<any> {
  try {
    return (await axiosInstance.post("/Campaign/Add", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useCampaignAdd() {
  return useMutation<any, Error, ICampaignAddRequest>((variables) =>
    campaignAdd(variables)
  );
}
