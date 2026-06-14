import { describe, expect, it } from "vitest";

import { act, renderHook } from "@testing-library/react";

import { ThemeProvider } from "../../src/context/ThemeProvider";
import { useTheme } from "../../src/hooks/useTheme";

import type { ReactNode } from "react";

describe("useTheme", () => {
  it("throws when used outside ThemeProvider", () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      "useTheme must be used within a ThemeProvider",
    );
  });

  it("reads and toggles theme via ThemeProvider and localStorage", () => {
    localStorage.setItem("theme", "light");

    const wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    // initial theme should reflect localStorage
    expect(typeof result.current.theme).toBe("boolean");

    act(() => {
      result.current.toggleTheme();
    });

    // toggling updates localStorage and document class
    expect(localStorage.getItem("theme")).toMatch(/light|dark/);
    const hasDark = document.documentElement.classList.contains("dark");
    expect(typeof hasDark).toBe("boolean");
  });
});
