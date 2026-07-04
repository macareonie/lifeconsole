import dotenv from "dotenv";

dotenv.config();

const testEnv = {
  NODE_ENV: "test",
  PORT: "3001",
  SUPABASE_URL: "http://127.0.0.1:54321",
  SUPABASE_KEY: "test-supabase-key",
  SUPABASE_URL_INTEGRATION_TEST: process.env.SUPABASE_URL,
  SUPABASE_KEY_INTEGRATION_TEST: process.env.SUPABASE_KEY,
  TEST_USER_EMAIL: process.env.TEST_USER_EMAIL,
  FRONTEND_MODE: "dev",
  FRONTEND_DEV_URL: "http://localhost:5173",
  FRONTEND_PROD_URL: "https://test-frontend-url.com",
};

for (const [key, value] of Object.entries(testEnv)) {
  if (!process.env[key]) {
    process.env[key] = value;
  }
}
