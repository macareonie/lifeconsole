import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ColumnEditForm } from "../../src/components/board/forms/ColumnEditForm";
import { renderWithProviders } from "../test-utils";

describe("ColumnEditForm", () => {
  it("calls cancel and disables save while pending", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    renderWithProviders(
      <ColumnEditForm
        column_id={3}
        initialTitle="In Progress"
        isPending
        onSubmit={vi.fn()}
        onCancel={onCancel}
      />,
    );

    const saveButton = screen.getByRole("button", {
      name: /saving/i,
    }) as HTMLButtonElement;
    expect(saveButton.disabled).toBe(true);

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
