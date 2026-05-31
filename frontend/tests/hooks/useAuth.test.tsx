import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useAuth } from "../../src/hooks/useAuth";
import {
  AuthContext,
  type AuthContextType,
} from "../../src/context/AuthContext";

describe("useAuth", () => {
  it("throws when used outside AuthProvider", () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth must be used within an AuthProvider",
    );
  });

  it("returns context value provided by AuthContext", () => {
    const fakeContext: AuthContextType = {
      session: null,
      isLoading: false,
      login: vi.fn().mockResolvedValue(undefined),
      signup: vi.fn().mockResolvedValue(undefined),
      logout: vi.fn().mockResolvedValue(undefined),
    };

    const wrapper = ({ children }: { children: any }) => (
      <AuthContext.Provider value={fakeContext}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toBe(fakeContext);
  });
});
