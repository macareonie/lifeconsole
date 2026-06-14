import { describe, expect, it, vi } from "vitest";

import { screen } from "@testing-library/react";

import LandingPage from "../../src/pages/LandingPage";
import { renderWithProviders } from "../test-utils";

const mockUseAuth = vi.fn();

vi.mock("../../src/hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("LandingPage", () => {
  it("links authenticated users to the board page", () => {
    mockUseAuth.mockReturnValue({ session: { user: { id: "user-1" } } });

    renderWithProviders(<LandingPage />);

    expect(screen.getByRole("heading", { name: /lifeconsole/i })).toBeTruthy();
    expect(
      screen.getByRole("link", { name: /get started/i }).getAttribute("href"),
    ).toBe("/board");
  });

  it("links anonymous users to the login page", () => {
    mockUseAuth.mockReturnValue({ session: null });

    renderWithProviders(<LandingPage />);

    expect(
      screen.getByRole("link", { name: /get started/i }).getAttribute("href"),
    ).toBe("/login");
  });
});
