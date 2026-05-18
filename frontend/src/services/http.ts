import axios from "axios";
import { env } from "../config/env";

export const backendApi = axios.create({
  baseURL: env.BACKEND_DEV_API,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

backendApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

backendApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "An unknown error occurred when communicating with the backend.";
    return Promise.reject(new Error(message));
  },
);

export default backendApi;
