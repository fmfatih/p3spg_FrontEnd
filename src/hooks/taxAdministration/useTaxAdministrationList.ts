import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useMutation } from "react-query";

export type GetTaxAdministrationListRequest = {
  page?: number;
  size?: number;
  orderByDesc?: boolean;
  orderBy?: string
  cityCode: string;
}

async function getTaxAdministrationList({cityCode, page= 0, size= 15, orderByDesc= true, orderBy = "CreatedDate"}: GetTaxAdministrationListRequest): Promise<any> {
  const data = {
    page,
    size,
    orderByDesc,
    orderBy,
    cityCode,
  };

  try {
    return (await axiosInstance.post("/TaxAdministration/List", data))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetTaxAdministrationList() {
  return useMutation<any, Error, GetTaxAdministrationListRequest>(
    (variables) => getTaxAdministrationList(variables)
  );
}