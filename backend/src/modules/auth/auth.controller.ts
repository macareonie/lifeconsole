import { type Request, type Response } from "express";
import { db } from "../../config/db.js";

// helper function(s)
async function checkUserExists(email: string): Promise<[boolean, boolean]> {
  let hasError = false;
  const { data, error } = await db
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();
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
    return res
      .status(500)
      .json({ error: "Internal server error: Checking user existence" });
  }

  if (userExists) {
    return res.status(400).json({ error: "User already exists" });
  }

  let { data, error } = await db.auth.signUp({
    email: email,
    password: password,
    options: {
      data: { display_name: username },
    },
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

    return res.status(200).json({
      message: `User ${username} registered successfully`,
      success: true,
      redirect: "/test",
      access_token: data.session?.access_token,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  let { data: userData, error: userError } = await db
    .from("users")
    .select("email")
    .eq("username", username)
    .single();

  if (userError) {
    return res.status(400).json({ error: "Invalid username or password" });
  }

  const email = userData?.email;
  console.log(email);
  let { data, error } = await db.auth.signInWithPassword({
    email: email,
    password: password,
  });

  console.log("Login - auth data:", data, "auth error:", error);

  if (error) {
    return res.status(400).json({ error: error.message });
  } else {
    return res.status(200).json({
      message: `User ${username} logged in successfully`,
      success: true,
      redirect: "/test",
      session: data.session,
    });
  }
};
