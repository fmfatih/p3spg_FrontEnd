import { StorageKeys } from "../common/storageKeys";
import axios from "axios";
import { API_ADDRESS } from "./server";

export const axiosInstance = axios.create({
  baseURL: API_ADDRESS,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem(StorageKeys.bearerToken);
    config.headers['Authorization'] = `Bearer ${token}`;
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);