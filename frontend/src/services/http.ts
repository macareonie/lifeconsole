import axios from "axios";

import { env } from "../config/env";

import type { AxiosError, AxiosResponse } from "axios";

export const backendApi = axios.create({
  baseURL:
    env.BACKEND_MODE === "prod" ? env.BACKEND_PROD_API : env.BACKEND_DEV_API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

backendApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "An unknown error occurred when communicating with the backend.";
    return Promise.reject(new Error(message));
  },
);

export default backendApi;
