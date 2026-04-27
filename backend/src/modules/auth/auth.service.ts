import { db } from "../../config/db.js";
import {
  addUser,
  checkUserExists,
  getUserEmailByUsername,
} from "../../repositories/user.repository.js";

import { ServiceError } from "../../errors/service.error.js";

export const registerUser = async (
  username: string,
  email: string,
  password: string,
) => {
  const { exists, hasError } = await checkUserExists(email);

  if (hasError) {
    throw new ServiceError(
      "AuthServiceError",
      "Internal server error: Checking user existence",
      500,
    );
  }

  if (exists) {
    throw new ServiceError("AuthServiceError", "User already exists", 400);
  }

  const { data, error } = await db.auth.signUp({
    email: email,
    password: password,
    options: {
      data: { display_name: username },
    },
  });

  if (error) {
    throw new ServiceError("AuthServiceError", error.message, 400);
  }

  const { error: userError } = await addUser(username, email);

  if (userError) {
    throw new ServiceError("AuthServiceError", userError.message, 400);
  }

  return {
    message: `User ${username} registered successfully`,
    success: true,
    redirect: "/",
    session: data.session,
  };
};

export const loginUser = async (username: string, password: string) => {
  const { email, hasError } = await getUserEmailByUsername(username);

  if (hasError) {
    throw new ServiceError(
      "AuthServiceError",
      "Internal server error: Getting user email",
      500,
    );
  }

  if (!email) {
    throw new ServiceError(
      "AuthServiceError",
      "Invalid username or password",
      400,
    );
  }

  let { data, error } = await db.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    throw new ServiceError("AuthServiceError", error.message, 400);
  }

  return {
    message: `User ${username} logged in successfully`,
    success: true,
    redirect: "/",
    session: data.session,
  };
};
