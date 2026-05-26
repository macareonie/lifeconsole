const testEnv = {
  NODE_ENV: "test",
  PORT: "3001",
  SUPABASE_URL: "http://127.0.0.1:54321",
  SUPABASE_KEY: "test-supabase-key",
  FRONTEND_DEV_URL: "http://localhost:5173",
};

for (const [key, value] of Object.entries(testEnv)) {
  if (!process.env[key]) {
    process.env[key] = value;
  }
}