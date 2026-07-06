import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || 3000,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
  FRONTEND_MODE: process.env.FRONTEND_MODE,
  FRONTEND_DEV_URL: process.env.FRONTEND_DEV_URL,
  FRONTEND_PROD_URL: process.env.FRONTEND_PROD_URL,
};
