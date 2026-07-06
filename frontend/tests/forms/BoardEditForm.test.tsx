import { describe, expect, it, vi } from "vitest";

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { BoardEditForm } from "../../src/components/kanban/forms/BoardEditForm";
import { renderWithProviders } from "../test-utils";

describe("BoardEditForm", () => {
  it("validates title and submits board updates", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    renderWithProviders(
      <BoardEditForm
        initialTitle="Sprint"
        isPending={false}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    const titleInput = screen.getByLabelText(
      /board title/i,
    ) as HTMLInputElement;
    await user.clear(titleInput);
    await user.click(screen.getByRole("button", { name: /save board/i }));
    expect(await screen.findByText(/board title is required/i)).toBeTruthy();

    await user.type(titleInput, "Roadmap");
    await user.click(screen.getByRole("button", { name: /save board/i }));

    expect(
      (onSubmit as unknown as { mock: { calls: unknown[][] } }).mock
        .calls[0][0],
    ).toEqual({
      title: "Roadmap",
    });
  });

  it("calls cancel and respects pending state", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    renderWithProviders(
      <BoardEditForm
        initialTitle="Sprint"
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
