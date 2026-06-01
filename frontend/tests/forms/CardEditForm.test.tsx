import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CardEditForm } from "../../src/components/board/forms/CardEditForm";
import { renderWithProviders } from "../test-utils";

describe("CardEditForm", () => {
  it("validates required title and metadata JSON", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <CardEditForm
        cardId={4}
        initialTitle="Task"
        initialSubtitle="Details"
        initialMetadata='{"priority":"low"}'
        isPending={false}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    const titleInput = screen.getByLabelText(/^title$/i) as HTMLInputElement;
    await user.clear(titleInput);

    fireEvent.change(screen.getByLabelText(/metadata json/i), {
      target: { value: "{invalid json" },
    });

    await user.click(screen.getByRole("button", { name: /save card/i }));

    expect(await screen.findByText(/card title is required/i)).toBeTruthy();
    expect(
      await screen.findByText(/metadata must be valid json/i),
    ).toBeTruthy();
  });

  it("submits edited values and handles cancel/pending", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onCancel = vi.fn();

    renderWithProviders(
      <CardEditForm
        cardId={4}
        initialTitle="Task"
        initialSubtitle="Details"
        initialMetadata='{"priority":"low"}'
        isPending
        onSubmit={onSubmit}
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

  it("submits valid payload", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    renderWithProviders(
      <CardEditForm
        cardId={4}
        initialTitle="Task"
        initialSubtitle="Details"
        initialMetadata='{"priority":"low"}'
        isPending={false}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    await user.clear(screen.getByLabelText(/^title$/i));
    await user.type(screen.getByLabelText(/^title$/i), "Updated task");
    await user.clear(screen.getByLabelText(/^subtitle$/i));
    await user.type(screen.getByLabelText(/^subtitle$/i), "Updated details");
    fireEvent.change(screen.getByLabelText(/metadata json/i), {
      target: { value: '{"priority":"high"}' },
    });

    await user.click(screen.getByRole("button", { name: /save card/i }));

    expect(
      (onSubmit as unknown as { mock: { calls: unknown[][] } }).mock
        .calls[0][0],
    ).toEqual({
      title: "Updated task",
      subtitle: "Updated details",
      metadata: '{"priority":"high"}',
    });
  });
});
