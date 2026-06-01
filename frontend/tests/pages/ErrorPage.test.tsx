import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ErrorPage from "../../src/pages/ErrorPage";
import { renderWithProviders } from "../test-utils";

describe("ErrorPage", () => {
  it("renders the not found message", () => {
    renderWithProviders(<ErrorPage />);

    expect(screen.getByRole("heading", { name: /error/i })).toBeTruthy();
    expect(
      screen.getByText(/the page you have navigated to does not exist/i),
    ).toBeTruthy();
  });
});
