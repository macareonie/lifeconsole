import { ServiceError } from "../errors/service.error.js";
import { getUserIdByEmail } from "../repositories/user.repository.js";

export const resolveUserId = async (email: string) => {
  if (!email) {
    throw new ServiceError(
      "UserServiceError",
      "UNAUTHENTICATED",
      "User must be authenticated to perform this action",
    );
  }
  const { userId, hasError } = await getUserIdByEmail(email);
  if (hasError) {
    throw new ServiceError(
      "UserServiceError",
      "DATABASE_ERROR",
      "Error getting user ID from email",
    );
  }
  return userId;
};
