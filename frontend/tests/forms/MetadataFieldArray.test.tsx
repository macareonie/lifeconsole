import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FormProvider, useForm } from "react-hook-form";
import type { ReactNode } from "react";
import { MetadataFieldArray } from "../../src/components/board/forms/MetadataFieldArray";
import { renderWithProviders } from "../test-utils";
import type { MetadataFormValues } from "../../src/utils/kanban/CardMetadataConversion";

function MetadataTestForm({
  children,
  defaultValues = { metadataEntries: [] },
  onSubmit,
}: {
  children: ReactNode;
  defaultValues?: MetadataFormValues;
  onSubmit: (values: MetadataFormValues) => void | Promise<void>;
}) {
  const methods = useForm<MetadataFormValues>({
    defaultValues,
    mode: "onSubmit",
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {children}
        <button type="submit">Save</button>
      </form>
    </FormProvider>
  );
}

describe("MetadataFieldArray", () => {
  it("shows empty state", () => {
    renderWithProviders(
      <MetadataTestForm onSubmit={vi.fn()}>
        <MetadataFieldArray inputIdPrefix="test-board" />
      </MetadataTestForm>,
    );

    expect(screen.getByText("No fields yet.")).toBeInTheDocument();
  });

  it("adds a row", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <MetadataTestForm onSubmit={vi.fn()}>
        <MetadataFieldArray inputIdPrefix="test-board" />
      </MetadataTestForm>,
    );

    await user.click(screen.getByRole("button", { name: /\+ add row/i }));

    expect(screen.getByPlaceholderText("Salary")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("$3000")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("validates missing key on submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    renderWithProviders(
      <MetadataTestForm onSubmit={onSubmit}>
        <MetadataFieldArray inputIdPrefix="test-board" />
      </MetadataTestForm>,
    );

    await user.click(screen.getByRole("button", { name: /\+ add row/i }));

    await user.click(screen.getByRole("button", { name: /save/i }));

    const errors = await screen.findAllByText("Field name is required");
    expect(errors.length).toBeGreaterThan(0);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("validates duplicate keys on submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    renderWithProviders(
      <MetadataTestForm
        onSubmit={onSubmit}
        defaultValues={{
          metadataEntries: [{ key: "Salary", value: "$3000" }],
        }}
      >
        <MetadataFieldArray inputIdPrefix="test-board" />
      </MetadataTestForm>,
    );

    await user.click(screen.getByRole("button", { name: /\+ add row/i }));

    const inputs = screen.getAllByPlaceholderText("Salary");
    await user.type(inputs[1], "Salary");

    await user.click(screen.getByRole("button", { name: /save/i }));

    const errors = await screen.findAllByText("Field names must be unique");
    expect(errors.length).toBeGreaterThan(0);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("removes a row", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <MetadataTestForm
        onSubmit={vi.fn()}
        defaultValues={{
          metadataEntries: [
            { key: "Salary", value: "$3000" },
            { key: "Location", value: "SG" },
          ],
        }}
      >
        <MetadataFieldArray inputIdPrefix="test-board" />
      </MetadataTestForm>,
    );

    expect(screen.getAllByRole("button", { name: /delete/i })).toHaveLength(2);

    await user.click(screen.getAllByRole("button", { name: /delete/i })[0]);

    await waitFor(() => {
      expect(screen.getAllByRole("button", { name: /delete/i })).toHaveLength(
        1,
      );
    });
  });

  it("uses the input id prefix", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <MetadataTestForm onSubmit={vi.fn()}>
        <MetadataFieldArray inputIdPrefix="board-123" />
      </MetadataTestForm>,
    );

    await user.click(screen.getByRole("button", { name: /\+ add row/i }));

    const keyInput = screen.getByPlaceholderText("Salary");
    const valueInput = screen.getByPlaceholderText("$3000");

    expect(keyInput.id).toContain("board-123-metadata-key");
    expect(valueInput.id).toContain("board-123-metadata-value");
  });
});
