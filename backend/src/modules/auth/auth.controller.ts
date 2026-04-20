import { type Request, type Response } from "express";
import { db } from "../../config/db.js";

// helper function(s)
async function checkUserExists(email: string): Promise<[boolean, boolean]> {
  let hasError = false;
  const { data, error } = await db
    .from("users")
    .select("*")
    .eq("email", email)
    .single();
  if (error) {
    hasError = true;
    return [false, hasError];
  }
  return [!!data, hasError];
}

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const [userExists, hasError] = await checkUserExists(email);

  if (hasError) {
    return res.status(500).json({ error: "Internal server error" });
  }

  if (userExists) {
    return res.status(400).json({ error: "User already exists" });
  }

  let { error } = await db.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  } else {
    let { error: userError } = await db.from("users").insert({
      username: username,
      email: email,
    });

    if (userError) {
      return res.status(400).json({ error: userError.message });
    }

    return res.status(201).json({
      message: `User ${username} registered successfully`,
      success: true,
      redirect: "/test",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let { error } = await db.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  } else {
    return res.status(200).json({
      message: "User logged in successfully",
      success: true,
      redirect: "/test",
    });
  }
};
