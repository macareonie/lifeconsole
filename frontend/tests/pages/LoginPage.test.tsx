import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import LoginPage from "../../src/pages/LoginPage";
import { renderWithProviders } from "../test-utils";

const navigate = vi.fn();
const login = vi.fn();
const signup = vi.fn();

vi.mock("../../src/hooks/useAuth", () => ({
  useAuth: () => ({ login, signup }),
}));

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

describe("LoginPage", () => {
  it("logs a user in and navigates home", async () => {
    const user = userEvent.setup();
    login.mockResolvedValue(undefined);

    renderWithProviders(<LoginPage />);

    await user.type(
      screen.getByLabelText(/username/i, { selector: "#login-username" }),
      "ada",
    );
    await user.type(
      screen.getByLabelText(/password/i, { selector: "#login-password" }),
      "password123",
    );
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(login).toHaveBeenCalledWith({
      username: "ada",
      password: "password123",
    });
    expect(navigate).toHaveBeenCalledWith("/");
  });
});
