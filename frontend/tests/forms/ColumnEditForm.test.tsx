import { screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ColumnEditForm } from "../../src/components/board/forms/ColumnEditForm";
import { renderWithProviders } from "../test-utils";

describe("ColumnEditForm", () => {
  it("validates position constraints before submission", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    renderWithProviders(
      <ColumnEditForm
        columnId={3}
        initialTitle="In Progress"
        initialPosition={2}
        isPending={false}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    const titleInput = screen.getByLabelText(
      /column title/i,
    ) as HTMLInputElement;
    const positionInput = screen.getByLabelText(
      /position/i,
    ) as HTMLInputElement;

    await user.clear(titleInput);
    fireEvent.change(positionInput, { target: { value: "0" } });
    await user.click(screen.getByRole("button", { name: /save column/i }));

    expect(onSubmit).not.toHaveBeenCalled();

    await user.type(titleInput, "Done");
    await user.clear(positionInput);
    await user.type(positionInput, "4");
    await user.click(screen.getByRole("button", { name: /save column/i }));

    expect(
      (onSubmit as unknown as { mock: { calls: unknown[][] } }).mock
        .calls[0][0],
    ).toEqual({
      title: "Done",
      position: 4,
    });
  });

  it("calls cancel and disables save while pending", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    renderWithProviders(
      <ColumnEditForm
        columnId={3}
        initialTitle="In Progress"
        initialPosition={2}
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
