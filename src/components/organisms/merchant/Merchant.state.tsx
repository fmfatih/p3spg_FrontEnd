import {atom, useRecoilState, useRecoilValue} from 'recoil';

export enum MerchantStateKeys {
  MerchantID = 'MerchantID',
}

const merchant = atom({
  key: MerchantStateKeys.MerchantID,
  default: -1
});

export const useUserMerchantId = () => useRecoilState(merchant);
export const useUserMerchantIdValue = () => useRecoilValue(merchant);
