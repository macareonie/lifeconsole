import { ServiceError } from "../errors/service.error.js";
import { getUserIdByEmail } from "../repositories/user.repository.js";

export const resolveUserId = async (email: string) => {
  if (!email) {
    throw new ServiceError(
      "UserServiceError",
      "User must be authenticated to perform this action",
      400,
    );
  }
  const { userId, hasError } = await getUserIdByEmail(email);
  if (hasError) {
    throw new ServiceError(
      "UserServiceError",
      "Internal server error: Getting user ID",
      500,
    );
  }
  return userId;
};
