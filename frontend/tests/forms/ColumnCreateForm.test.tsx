import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ColumnCreateForm } from "../../src/components/board/forms/ColumnCreateForm";
import { renderWithProviders } from "../test-utils";

describe("ColumnCreateForm", () => {
  it("validates required title, submits and resets", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    renderWithProviders(
      <ColumnCreateForm
        isPending={false}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /create column/i }));
    expect(await screen.findByText(/column title is required/i)).toBeTruthy();

    const titleInput = screen.getByLabelText(
      /column title/i,
    ) as HTMLInputElement;
    await user.type(titleInput, "Done");
    await user.click(screen.getByRole("button", { name: /create column/i }));

    expect(
      (onSubmit as unknown as { mock: { calls: unknown[][] } }).mock
        .calls[0][0],
    ).toEqual({
      title: "Done",
    });
    expect(titleInput.value).toBe("");
  });

  it("calls onCancel and disables submit while pending", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    renderWithProviders(
      <ColumnCreateForm isPending onSubmit={vi.fn()} onCancel={onCancel} />,
    );

    const button = screen.getByRole("button", {
      name: /creating/i,
    }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
