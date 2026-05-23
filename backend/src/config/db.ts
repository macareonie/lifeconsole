import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

export const db = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

export const createFreshClient = () =>
  createClient(env.SUPABASE_URL, env.SUPABASE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
