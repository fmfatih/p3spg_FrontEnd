import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useMutation } from "react-query";

export type GetDefaultVPosSettingsListRequest = {
  page?: number;
  size?: number;
  orderByDesc?: boolean;
  orderBy?: string;
  bankCode: string;
  merchantId?: number;
};

async function getDefaultVposSettingsList({
  bankCode,
  page = 0,
  size = 15,
  orderByDesc = true,
  orderBy = "CreateDate",
  merchantId,
}: GetDefaultVPosSettingsListRequest): Promise<any> {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy,
    bankCode,
    merchantId,
  };
  try {
    return (await axiosInstance.post("/DefaultVposSettingSetting/List", data))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetDefaultVPosSettingsList() {
  return useMutation<any, Error, GetDefaultVPosSettingsListRequest>(
    (variables) => getDefaultVposSettingsList(variables)
  );
}
