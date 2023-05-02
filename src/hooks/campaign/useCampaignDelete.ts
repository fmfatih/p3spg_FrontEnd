import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { BaseResponse } from "../_types";
import { useMutation } from "react-query";

export type DeleteCampaignRequest = {
  id: number | string;
};

export type DeleteCampaignResponse = BaseResponse<any>;

async function campaignDelete(data: DeleteCampaignRequest): Promise<any> {
  try {
    const id1 = data.id;
    return (await axiosInstance.delete(`/Campaign/Delete?id=${id1}`)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useCampaignDelete() {
  return useMutation<any, Error, DeleteCampaignRequest>((variables) =>
    campaignDelete(variables)
  );
}
