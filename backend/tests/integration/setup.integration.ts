import dotenv from "dotenv";

dotenv.config();

const required = ["SUPABASE_URL", "SUPABASE_KEY", "TEST_USER_EMAIL"];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(
      `Integration tests require ${key} to be set. ` +
        `Add it to .env or your shell before running npm run test:integration.`,
    );
  }
}
