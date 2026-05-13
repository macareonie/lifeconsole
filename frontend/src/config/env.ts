import dotenv from "dotenv";

dotenv.config();

export const env = {
  BACKEND_DEV_API: process.env.VITE_DEV_BASE_BACKEND_URL,
};
