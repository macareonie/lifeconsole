import { describe, it, expect, vi } from "vitest";
import { errorMiddleware } from "../../src/middleware/error.middleware.js";

describe("error.middleware", () => {
  it("sends status and json from custom error", () => {
    const err = { message: "fail", statusCode: 418 } as any;
    const json = vi.fn();
    const res: any = { status: vi.fn(() => ({ json })) };
    const next = vi.fn();

    errorMiddleware(err, {} as any, res, next as any);

    expect(res.status).toHaveBeenCalledWith(418);
    expect(json).toHaveBeenCalledWith({ error: "fail" });
  });

  it("sends status and json from default error", () => {
    const err = {} as any;
    const json = vi.fn();
    const res: any = { status: vi.fn(() => ({ json })) };
    const next = vi.fn();

    errorMiddleware(err, {} as any, res, next as any);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });
});
