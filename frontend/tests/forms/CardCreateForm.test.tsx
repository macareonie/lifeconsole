import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CardCreateForm } from "../../src/components/board/forms/CardCreateForm";
import { renderWithProviders } from "../test-utils";

describe("CardCreateForm", () => {
  it("validates required fields and metadata field names", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <CardCreateForm
        column_id={7}
        isPending={false}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /create card/i }));

    expect(await screen.findByText(/card title is required/i)).toBeTruthy();

    await user.type(screen.getByLabelText(/card title/i), "Ship release");
    await user.click(screen.getByRole("button", { name: /\+ Add Row/i }));
    await user.click(screen.getByRole("button", { name: /create card/i }));

    expect(await screen.findByText(/field name is required/i)).toBeTruthy();
  });

  it("submits metadata fields as a json object and resets after success", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onCancel = vi.fn();

    renderWithProviders(
      <CardCreateForm
        column_id={7}
        isPending={false}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );

    await user.type(screen.getByLabelText(/card title/i), "Ship release");
    await user.type(screen.getByLabelText(/subtitle/i), "Before Friday");
    await user.click(screen.getByRole("button", { name: /\+ Add Row/i }));
    await user.type(screen.getByLabelText(/Field name/i), "Salary");
    await user.type(screen.getByLabelText(/Field value/i), "$3000");

    await user.click(screen.getByRole("button", { name: /create card/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: "Ship release",
      subtitle: "Before Friday",
      metadata: { Salary: "$3000" },
    });

    expect(
      (screen.getByLabelText(/card title/i) as HTMLInputElement).value,
    ).toBe("");
    expect((screen.getByLabelText(/subtitle/i) as HTMLInputElement).value).toBe(
      "",
    );
    expect(screen.getByText(/no fields yet/i)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
