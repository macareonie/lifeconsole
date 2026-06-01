import { screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CardCreateForm } from "../../src/components/board/forms/CardCreateForm";
import { renderWithProviders } from "../test-utils";

describe("CardCreateForm", () => {
  it("validates required fields and JSON metadata", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <CardCreateForm
        columnId={7}
        isPending={false}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /create card/i }));

    expect(await screen.findByText(/card title is required/i)).toBeTruthy();

    await user.type(screen.getByLabelText(/card title/i), "Ship release");
    fireEvent.change(screen.getByLabelText(/metadata json/i), {
      target: { value: "{bad json" },
    });
    await user.click(screen.getByRole("button", { name: /create card/i }));

    expect(
      await screen.findByText(/metadata must be valid json/i),
    ).toBeTruthy();
  });

  it("submits values, resets after success, and cancels", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onCancel = vi.fn();

    renderWithProviders(
      <CardCreateForm
        columnId={7}
        isPending={false}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );

    await user.type(screen.getByLabelText(/card title/i), "Ship release");
    await user.type(screen.getByLabelText(/subtitle/i), "Before Friday");
    fireEvent.change(screen.getByLabelText(/metadata json/i), {
      target: { value: '{"priority":"high"}' },
    });
    await user.click(screen.getByRole("button", { name: /create card/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: "Ship release",
      subtitle: "Before Friday",
      metadata: '{"priority":"high"}',
    });

    expect(
      (screen.getByLabelText(/card title/i) as HTMLInputElement).value,
    ).toBe("");
    expect((screen.getByLabelText(/subtitle/i) as HTMLInputElement).value).toBe(
      "",
    );
    expect(
      (screen.getByLabelText(/metadata json/i) as HTMLTextAreaElement).value,
    ).toBe("{}");

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
