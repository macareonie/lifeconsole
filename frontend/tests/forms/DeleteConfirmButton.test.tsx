import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DeleteConfirmButton } from "../../src/components/board/forms/DeleteConfirmButton";
import { renderWithProviders } from "../test-utils";

describe("DeleteConfirmButton", () => {
  it("renders with the correct label", () => {
    renderWithProviders(
      <DeleteConfirmButton
        confirmMessage="Delete board 'Test' and all of its content?"
        label="Delete board"
        pendingLabel="Deleting..."
        isPending={false}
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.getByText("Delete board")).toBeInTheDocument();
  });

  it("shows pending label and disables button when isPending is true", () => {
    renderWithProviders(
      <DeleteConfirmButton
        confirmMessage="Delete board?"
        label="Delete board"
        pendingLabel="Deleting..."
        isPending={true}
        onConfirm={vi.fn()}
      />,
    );

    const trigger = screen.getByText("Deleting...");
    expect(trigger).toBeDisabled();
  });

  it("opens dialog on click and shows confirm message", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <DeleteConfirmButton
        confirmMessage='Delete board "Test" and all of its content?'
        label="Delete board"
        pendingLabel="Deleting..."
        isPending={false}
        onConfirm={vi.fn()}
      />,
    );

    // Click the FIRST "Delete board" button (trigger, outside dialog)
    const buttons = screen.getAllByText("Delete board");
    await user.click(buttons[0]);

    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
    expect(
      screen.getByText('Delete board "Test" and all of its content?'),
    ).toBeInTheDocument();
  });

  it("closes dialog when Cancel is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <DeleteConfirmButton
        confirmMessage="Delete board?"
        label="Delete board"
        pendingLabel="Deleting..."
        isPending={false}
        onConfirm={vi.fn()}
      />,
    );

    // Open dialog - click first button
    const triggerButton = screen.getAllByText("Delete board")[0];
    await user.click(triggerButton);
    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();

    // Click Cancel (unique text)
    await user.click(screen.getByText("Close"));

    expect(screen.queryByText("Confirm Deletion")).not.toBeInTheDocument();
  });

  it("calls onConfirm and closes dialog when confirm is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn().mockResolvedValue(undefined);

    renderWithProviders(
      <DeleteConfirmButton
        confirmMessage="Delete board?"
        label="Delete board"
        pendingLabel="Deleting..."
        isPending={false}
        onConfirm={onConfirm}
      />,
    );

    // Open dialog - click first button
    const triggerButton = screen.getAllByText("Delete board")[0];
    await user.click(triggerButton);

    // Wait for dialog to open
    await vi.waitFor(() => {
      expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
    });

    // Now there are 2 buttons with "Delete board" - click the SECOND one (confirm in dialog)
    const confirmButton = screen.getAllByText("Delete board")[1];
    await user.click(confirmButton);

    await vi.waitFor(() => expect(onConfirm).toHaveBeenCalledTimes(1));
    expect(screen.queryByText("Confirm Deletion")).not.toBeInTheDocument();
  });

  it("prevents opening dialog when isPending is true", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <DeleteConfirmButton
        confirmMessage="Delete board?"
        label="Delete board"
        pendingLabel="Deleting..."
        isPending={true}
        onConfirm={vi.fn()}
      />,
    );

    // Click disabled button (only one exists)
    await user.click(screen.getAllByText("Deleting...")[0]);

    expect(screen.queryByText("Confirm Deletion")).not.toBeInTheDocument();
  });
});
