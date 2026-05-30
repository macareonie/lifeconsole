import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import BoardListPage from "../../src/pages/BoardListPage";
import { renderWithProviders } from "../test-utils";

const mutateAsync = vi.fn();

vi.mock("../../src/hooks/kanban/useBoards", () => ({
  useBoards: () => ({
    data: [{ id: 1, title: "Sprint planning" }],
    isPending: false,
    isError: false,
    error: null,
  }),
}));

vi.mock("../../src/hooks/kanban/useBoardMutations", () => ({
  useBoardMutations: () => ({
    createBoardMutation: {
      mutateAsync,
      isPending: false,
      isError: false,
      error: null,
    },
  }),
}));

describe("BoardListPage", () => {
  it("renders boards and creates a new board", async () => {
    const user = userEvent.setup();
    mutateAsync.mockResolvedValue(undefined);

    renderWithProviders(<BoardListPage />);

    expect(screen.getByText(/sprint planning/i)).toBeTruthy();

    await user.type(screen.getByLabelText(/board title/i), "Roadmap");
    await user.click(screen.getByRole("button", { name: /create board/i }));

    expect(mutateAsync).toHaveBeenCalledWith("Roadmap");
  });
});
