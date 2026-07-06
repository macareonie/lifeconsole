export const ERROR_CODES = {
  VALIDATION_ERROR: {
    statusCode: 400,
    message: "The provided data is invalid.",
  },
  INVALID_MOOD_VALUE: {
    statusCode: 400,
    message: "Mood must be an integer between 1 and 5.",
  },
  MISSING_REQUIRED_FIELD: {
    statusCode: 400,
    message: "A required field is missing.",
  },
  NOT_FOUND: {
    statusCode: 404,
    message: "The requested resource was not found.",
  },
  UNAUTHENTICATED: {
    statusCode: 401,
    message: "You must be logged in to perform this action.",
  },
  FORBIDDEN: {
    statusCode: 403,
    message: "You do not have permission to perform this action.",
  },
  DUPLICATE_ENTRY: {
    statusCode: 409,
    message: "This entry already exists.",
  },
  DATABASE_ERROR: {
    statusCode: 500,
    message: "A database error occurred. Please try again.",
  },
  INTERNAL_ERROR: {
    statusCode: 500,
    message: "An unexpected error occurred. Please try again.",
  },
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;
