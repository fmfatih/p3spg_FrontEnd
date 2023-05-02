import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../config/axios";

export interface IMerchantAddressUpdateRequest {
  id?: number;
  merchantId?: number;
  countryCode?: "TR";
  primaryAddress?: true;
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

async function merchantAddressUpdate(
  data: IMerchantAddressUpdateRequest
): Promise<any> {
  try {
    return (await axiosInstance.put("/MerchantAddress/Update", data)).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useMerchantAddressUpdate() {
  return useMutation<any, Error, IMerchantAddressUpdateRequest>((variables) =>
    merchantAddressUpdate(variables)
  );
}
