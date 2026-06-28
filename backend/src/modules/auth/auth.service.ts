import { createFreshClient } from "../../config/db.js";
import { ERROR_CODES } from "../../errors/error-codes.js";
import { ServiceError } from "../../errors/service.error.js";
import {
  addUser,
  checkUserExists,
  getUserEmailByUsername,
} from "../../repositories/user.repository.js";

export const registerUserService = async (
  username: string,
  email: string,
  password: string,
) => {
  const { exists, hasError } = await checkUserExists(email);

  if (hasError) {
    throw new ServiceError("AuthServiceError", "DATABASE_ERROR", hasError);
  }

  if (exists) {
    throw new ServiceError(
      "AuthServiceError",
      "DUPLICATE_ENTRY",
      `User with email ${email} already exists`,
    );
  }

  const authClient = createFreshClient();
  const { data, error } = await authClient.auth.signUp({
    email: email,
    password: password,
    options: {
      data: { display_name: username },
    },
  });

  if (error) {
    throw new ServiceError("AuthServiceError", "DATABASE_ERROR", error.message);
  }

  const { error: userError } = await addUser(username, email);

  if (userError) {
    throw new ServiceError(
      "AuthServiceError",
      "DATABASE_ERROR",
      userError.message,
    );
  }

  return {
    message: `User ${username} registered successfully`,
    success: true,
    redirect: "/",
    session: data.session,
  };
};

export const loginUserService = async (username: string, password: string) => {
  const { email, hasError } = await getUserEmailByUsername(username);

  if (hasError) {
    throw new ServiceError("AuthServiceError", "DATABASE_ERROR", hasError);
  }

  if (!email) {
    throw new ServiceError(
      "AuthServiceError",
      "DATABASE_ERROR",
      `No user found with username ${username}`,
    );
  }

  const authClient = createFreshClient();
  let { data, error } = await authClient.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    throw new ServiceError("AuthServiceError", "DATABASE_ERROR", error.message);
  }

  return {
    message: `User ${username} logged in successfully`,
    success: true,
    redirect: "/",
    session: data.session,
  };
};

export const logoutUserService = async () => {
  const authClient = createFreshClient();
  const { error } = await authClient.auth.signOut();
  if (error) {
    throw new ServiceError("AuthServiceError", "DATABASE_ERROR", error.message);
  }
  return {
    message: "User logged out successfully",
    success: true,
    redirect: "/",
  };
};

export const getUserFromAccessTokenService = async (accessToken: string) => {
  const authClient = createFreshClient();
  const { data, error } = await authClient.auth.getUser(accessToken);
  if (error) {
    throw new ServiceError("AuthServiceError", "DATABASE_ERROR", error.message);
  }
  return { data, error };
};
