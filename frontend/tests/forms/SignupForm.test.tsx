import { describe, expect, it, vi } from "vitest";

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SignupForm from "../../src/components/auth/SignupForm";
import { renderWithProviders } from "../test-utils";

describe("SignupForm", () => {
  it("shows validation errors and submits valid values", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    renderWithProviders(
      <SignupForm onSubmit={onSubmit} loading={false} error={null} />,
    );

    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(await screen.findByText(/email is required/i)).toBeTruthy();
    expect(await screen.findByText(/username is required/i)).toBeTruthy();
    expect(await screen.findByText(/password is required/i)).toBeTruthy();

    await user.type(screen.getByLabelText(/email/i), "ada@example.com");
    await user.type(screen.getByLabelText(/username/i), "ada");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(
      (onSubmit as unknown as { mock: { calls: unknown[][] } }).mock
        .calls[0][0],
    ).toEqual({
      email: "ada@example.com",
      username: "ada",
      password: "password123",
    });
  });

  it("disables submit while loading", () => {
    renderWithProviders(<SignupForm onSubmit={vi.fn()} loading error={null} />);

    expect(screen.getByRole("button", { name: /signing up/i })).toBeTruthy();
    expect(
      (screen.getByRole("button", { name: /signing up/i }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
  });
});
