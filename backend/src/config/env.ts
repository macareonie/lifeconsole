import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
  FRONTEND_DEV_URL: process.env.FRONTEND_DEV_URL,
};
