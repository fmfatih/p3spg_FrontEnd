import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IMerchantAddressAddRequest {
  merchantId?: number;
  primaryAddress?: boolean;
  countryCode?: "TR";
  cityId?: number;
  districtId?: number;
  addressLine1?: string;
  addressLine2?: string;
  zipCode?: string;
  emailAddress1?: string;
  emailAddress2?: string | undefined;
  mobilePhoneNumber?: string;
  phoneNumber?: string;
  secondaryPhoneNumber?: string;
  faxNumber?: string;
}

async function merchantAddressAdd(
  data: IMerchantAddressAddRequest
): Promise<any> {
  try {
    return (await axiosInstance.post("/MerchantAddress/add", data))
      .data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useMerchantAddressAdd() {
  return useMutation<any, Error, IMerchantAddressAddRequest>(
    (variables) => merchantAddressAdd(variables)
  );
}
