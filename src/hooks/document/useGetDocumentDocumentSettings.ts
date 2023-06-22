import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useMutation } from "react-query";

export type GetDocumentDocumentSettingsRequest = {
  posType: number;
  companyType: number;
};

async function getDocumentDocumentSettings({
  posType,
  companyType,
}: GetDocumentDocumentSettingsRequest): Promise<any> {
  const data = {
    posType,
    companyType,
  };
  try {
    return (await axiosInstance.post("/Document/DocumentSettings", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetDocumentDocumentSettings() {
  return useMutation<any, Error, GetDocumentDocumentSettingsRequest>(
    (variables) => getDocumentDocumentSettings(variables)
  );
}

