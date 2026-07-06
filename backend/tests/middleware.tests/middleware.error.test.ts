import { describe, expect, it, vi } from "vitest";

import { ERROR_CODES } from "../../src/errors/error-codes.js";
import { ServiceError } from "../../src/errors/service.error.js";
import { errorMiddleware } from "../../src/middleware/error.middleware.js";

describe("error.middleware", () => {
  it("sends status and json from custom error", () => {
    const err = new ServiceError("TestServiceError", "VALIDATION_ERROR");
    const json = vi.fn();
    const res: any = { status: vi.fn(() => ({ json })) };
    const next = vi.fn();

    errorMiddleware(err, {} as any, res, next as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      success: false,
      code: "VALIDATION_ERROR",
      message: ERROR_CODES.VALIDATION_ERROR.message,
    });
  });

  it("sends status and json from default error", () => {
    const err = {
      success: false,
      code: "INTERNAL_ERROR",
      message: ERROR_CODES.INTERNAL_ERROR.message,
    };
    const json = vi.fn();
    const res: any = { status: vi.fn(() => ({ json })) };
    const next = vi.fn();

    errorMiddleware(err, {} as any, res, next as any);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      success: false,
      code: "INTERNAL_ERROR",
      message: ERROR_CODES.INTERNAL_ERROR.message,
    });
  });
});
