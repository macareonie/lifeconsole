import { describe, expect, it, vi } from "vitest";

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CardEditForm } from "../../src/components/board/forms/CardEditForm";
import { renderWithProviders } from "../test-utils";

describe("CardEditForm", () => {
  it("validates required title and duplicate metadata fields", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <CardEditForm
        card_id={4}
        initialTitle="Task"
        initialSubtitle="Details"
        initialMetadata={{ priority: "low" }}
        isPending={false}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    const titleInput = screen.getByLabelText(/^title$/i) as HTMLInputElement;
    await user.clear(titleInput);

    await user.clear(screen.getByLabelText(/Field name/i));
    await user.clear(screen.getByLabelText(/Field value/i));
    await user.type(screen.getByLabelText(/Field name/i), "Company");
    await user.type(screen.getByLabelText(/Field value/i), "Google");
    await user.click(screen.getByRole("button", { name: /\+ Add Row/i }));
    const secondFieldName = screen.getAllByLabelText(/Field name/i)[1];
    await user.type(secondFieldName, "Company");

    await user.click(screen.getByRole("button", { name: /save card/i }));

    expect(await screen.findByText(/card title is required/i)).toBeTruthy();
    expect(
      (await screen.findAllByText(/field names must be unique/i)).length,
    ).toBeGreaterThan(0);
  });

  it("submits edited values and handles cancel/pending", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onCancel = vi.fn();

    renderWithProviders(
      <CardEditForm
        card_id={4}
        initialTitle="Task"
        initialSubtitle="Details"
        initialMetadata={{ priority: "low" }}
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
        card_id={4}
        initialTitle="Task"
        initialSubtitle="Details"
        initialMetadata={{ priority: "low" }}
        isPending={false}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    await user.clear(screen.getByLabelText(/^title$/i));
    await user.type(screen.getByLabelText(/^title$/i), "Updated task");
    await user.clear(screen.getByLabelText(/^subtitle$/i));
    await user.type(screen.getByLabelText(/^subtitle$/i), "Updated details");
    await user.clear(screen.getByLabelText(/Field name/i));
    await user.clear(screen.getByLabelText(/Field value/i));
    await user.type(screen.getByLabelText(/Field name/i), "Priority");
    await user.type(screen.getByLabelText(/Field value/i), "high");

    await user.click(screen.getByRole("button", { name: /save card/i }));

    expect(
      (onSubmit as unknown as { mock: { calls: unknown[][] } }).mock
        .calls[0][0],
    ).toEqual({
      title: "Updated task",
      subtitle: "Updated details",
      metadata: { Priority: "high" },
    });
  });
});
