import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useMutation } from "react-query";

export type GetDefaultVPosDetailSettingsRequest = {
  id: number | string;
}

async function getDefaultVPosSettingsDetail({id}: GetDefaultVPosDetailSettingsRequest): Promise<any> {
  try {
    return (await axiosInstance.get(`/DefaultVposSettingSetting/Get?id=${id}`))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetDefaultVPosSettingsDetail() {
  return useMutation<any, Error, GetDefaultVPosDetailSettingsRequest>(
    (variables) => getDefaultVPosSettingsDetail(variables)
  );
}
