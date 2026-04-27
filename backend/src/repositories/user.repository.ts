import { db } from "../config/db.js";

export const addUser = async (username: string, email: string) => {
  const { data, error } = await db.from("users").insert({
    username: username,
    email: email,
  });
  return { data, error };
};

export const getUserIdByEmail = async (email: string) => {
  const { data, error } = await db
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (error) {
    return { userId: null as number | null, hasError: true };
  }
  return { userId: data?.id, hasError: false };
};

export const checkUserExists = async (email: string) => {
  const { data, error } = await db
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    return { exists: false, hasError: true };
  }

  return { exists: !!data, hasError: false };
};

export const getUserEmailByUsername = async (username: string) => {
  const { data, error } = await db
    .from("users")
    .select("email")
    .eq("username", username)
    .maybeSingle();

  if (error) {
    return { email: null as string | null, hasError: true };
  }

  return { email: data?.email, hasError: false };
};
