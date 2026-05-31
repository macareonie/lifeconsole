import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginPage from "../../src/pages/LoginPage";
import { renderWithRouter } from "../test-utils";

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

beforeEach(() => {
  vi.clearAllMocks();
});

describe("LoginPage", () => {
  it("logs a user in and navigates home", async () => {
    const user = userEvent.setup();
    login.mockResolvedValue(undefined);

    renderWithRouter(<LoginPage />, {
      path: "/login",
      route: "/login",
    });

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

  it("signs up a user and navigates home", async () => {
    const user = userEvent.setup();
    signup.mockResolvedValue(undefined);

    renderWithRouter(<LoginPage />, {
      path: "/login",
      route: "/login",
    });

    await user.type(
      screen.getByLabelText(/email/i, { selector: "#signup-email" }),
      "ada@example.com",
    );
    await user.type(
      screen.getByLabelText(/username/i, { selector: "#signup-username" }),
      "ada",
    );
    await user.type(
      screen.getByLabelText(/password/i, { selector: "#signup-password" }),
      "password123",
    );
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(signup).toHaveBeenCalledWith({
      email: "ada@example.com",
      username: "ada",
      password: "password123",
    });
    expect(navigate).toHaveBeenCalledWith("/");
  });

  it("shows signup errors", async () => {
    const user = userEvent.setup();
    signup.mockRejectedValue(new Error("Email already in use"));
    renderWithRouter(<LoginPage />, {
      path: "/login",
      route: "/login",
    });

    await user.type(
      screen.getByLabelText(/email/i, { selector: "#signup-email" }),
      "ada@example.com",
    );

    await user.type(
      screen.getByLabelText(/username/i, { selector: "#signup-username" }),
      "ada",
    );
    await user.type(
      screen.getByLabelText(/password/i, { selector: "#signup-password" }),
      "wrongpassword",
    );
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(await screen.findByText(/email already in use/i)).toBeTruthy();
  });

  it("shows login errors", async () => {
    const user = userEvent.setup();
    login.mockRejectedValue(new Error("Invalid credentials"));
    renderWithRouter(<LoginPage />, {
      path: "/login",
      route: "/login",
    });

    await user.type(
      screen.getByLabelText(/username/i, { selector: "#login-username" }),
      "ada",
    );
    await user.type(
      screen.getByLabelText(/password/i, { selector: "#login-password" }),
      "wrongpassword",
    );
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeTruthy();
  });
});
