import { StorageKeys } from "../common/storageKeys";
import { atom, useRecoilState, useRecoilValue } from "recoil";

export enum UserStateKeys {
  Info = "Info",
}

export const initialUserInfoState = {
  expireDate: new Date(),
  fullName: localStorage.getItem(StorageKeys.userName) || "",
  phoneNumber: "",
  sessionId: "",
  token: "",
  tokenType: "",
  order: localStorage.getItem(StorageKeys.order) || 0,
  merchantId: localStorage.getItem(StorageKeys.merchantId) || 0,
  merchantName: localStorage.getItem(StorageKeys.merchantName) || "",
};

const user = atom({
  key: UserStateKeys.Info,
  default: initialUserInfoState,
});

export const useUserInfo = () => useRecoilState(user);
export const useUserInfoValue = () => useRecoilValue(user);
