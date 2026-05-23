import dotenv from "dotenv";

dotenv.config();

const requireEnv = (value: string | undefined, name: string) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const env = {
  PORT: requireEnv(process.env.PORT, "PORT"),
  SUPABASE_URL: requireEnv(process.env.SUPABASE_URL, "SUPABASE_URL"),
  SUPABASE_KEY: requireEnv(process.env.SUPABASE_KEY, "SUPABASE_KEY"),
  FRONTEND_DEV_URL: requireEnv(
    process.env.FRONTEND_DEV_URL,
    "FRONTEND_DEV_URL",
  ),
};
