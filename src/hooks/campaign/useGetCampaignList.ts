import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { BasePagingResponse } from "../_types";

export type GetCampaignListRequest = {
  page?: number;
  size?: number;
  orderByDesc?: boolean;
  orderBy?: string;
  cardBin?: Array<string>;
  bankCode?: string;
  startDate?: string;
  endDate?: string;
};

export type GetCampaignListResponse = BasePagingResponse<Array<any>>;

async function getCampaignList({
  page = 0,
  size = 15,
  orderByDesc = true,
  orderBy = "CreateDate",
  ...req
}: GetCampaignListRequest): Promise<GetCampaignListResponse> {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy,
    ...req,
  };
  try {
    return (await axiosInstance.post("/Campaign/List", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetCampaignList() {
  return useMutation<GetCampaignListResponse, Error, GetCampaignListRequest>((variables) =>
    getCampaignList(variables)
  );
}
