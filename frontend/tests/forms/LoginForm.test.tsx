import { describe, expect, it, vi } from "vitest";

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import LoginForm from "../../src/components/auth/LoginForm";
import { renderWithProviders } from "../test-utils";

describe("LoginForm", () => {
  it("shows validation and submits valid credentials", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    renderWithProviders(
      <LoginForm onSubmit={onSubmit} loading={false} error={null} />,
    );

    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(await screen.findByText(/username is required/i)).toBeTruthy();
    expect(await screen.findByText(/password is required/i)).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText(/username/i), "ada");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(onSubmit).toHaveBeenCalledWith(
      { username: "ada", password: "password123" },
      expect.anything(),
    );
  });

  it("disables submission while loading", () => {
    renderWithProviders(<LoginForm onSubmit={vi.fn()} loading error={null} />);

    expect(
      (screen.getByRole("button", { name: /logging in/i }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
  });
});
