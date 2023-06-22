import { axiosInstance } from "../../config/axios";
import { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";
import { QueryKeys } from "../queryKeys";

// export type GetMerchantVPosGetListByIdRequest = {
//   id: number;
// };

// async function getMerchantVPosGetListById({
//   id,
// }: GetMerchantVPosGetListByIdRequest): Promise<any> {
//   try {
//     return (
//       await axiosInstance.get(`/MerchantVpos/GetListById?merchantId=${id}`)
//     ).data;
//   } catch (ex) {
//     throw ((ex as AxiosError).response?.data as any).error;
//   }
// }

// export function useGetMerchantVPosGetListById({
//   id,
// }: GetMerchantVPosGetListByIdRequest) {
//   return useQuery<any | undefined, Error>(
//     QueryKeys.GetMerchantVposGetList,
//     () => getMerchantVPosGetListById({ id })
//   );
// }


export type GetMerchantVPosGetListByIdRequest = {
  id: number | string;
};

export type GetMerchantVposGetListByIdResponse = any;

async function getMerchantVPosGetListById(data: GetMerchantVPosGetListByIdRequest): Promise<any> {
  try {
    const id1 = data.id;
    return (
      await axiosInstance.get(`/MerchantVpos/GetListById?merchantId=${id1}`)
    ).data;
  } catch (ex) {
    throw ((ex as AxiosError).response?.data as any).error;
  }
}

export function useGetMerchantVPosGetListById() {
  return useMutation<any, Error, GetMerchantVPosGetListByIdRequest>((variables) =>
  getMerchantVPosGetListById(variables)
  );
}
