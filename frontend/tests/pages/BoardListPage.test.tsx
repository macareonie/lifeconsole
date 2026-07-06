import { beforeEach, describe, expect, it, vi } from "vitest";

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import BoardListPage from "../../src/pages/BoardListPage";
import { renderWithRouter } from "../test-utils";

const mockUseBoards = vi.fn();
const mutateAsync = vi.fn();

vi.mock("../../src/hooks/kanban/useBoards", () => ({
  useBoards: () => mockUseBoards(),
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

beforeEach(() => {
  vi.clearAllMocks();
  mockUseBoards.mockReturnValue({
    data: [{ id: 1, title: "Sprint planning" }],
    isPending: false,
    isError: false,
    error: null,
  });
});

describe("BoardListPage", () => {
  it("renders boards and creates a new board", async () => {
    const user = userEvent.setup();
    mutateAsync.mockResolvedValue(undefined);

    renderWithRouter(<BoardListPage />, {
      path: "/board",
      route: "/board",
    });

    expect(screen.getByText(/sprint planning/i)).toBeTruthy();
    await user.type(screen.getByLabelText(/board title/i), "Roadmap");
    await user.click(screen.getByRole("button", { name: /create board/i }));

    expect(mutateAsync).toHaveBeenCalledWith("Roadmap");
  });

  it("shows a loading state while boards are pending", () => {
    mockUseBoards.mockReturnValue({
      data: null,
      isPending: true,
      isError: false,
      error: null,
    });

    renderWithRouter(<BoardListPage />, {
      path: "/board",
      route: "/board",
    });

    expect(screen.getByText(/loading boards/i)).toBeTruthy();
  });

  it("shows an error state when loading boards fails", () => {
    mockUseBoards.mockReturnValue({
      data: null,
      isPending: false,
      isError: true,
      error: new Error("failed to fetch boards"),
    });

    renderWithRouter(<BoardListPage />, {
      path: "/board",
      route: "/board",
    });

    expect(
      screen.getByText(/error loading boards: failed to fetch boards/i),
    ).toBeTruthy();
  });

  it("shows the empty state when there are no boards", () => {
    mockUseBoards.mockReturnValue({
      data: [],
      isPending: false,
      isError: false,
      error: null,
    });

    renderWithRouter(<BoardListPage />, {
      path: "/board",
      route: "/board",
    });

    expect(
      screen.getByText(/no boards yet, time to create one!/i),
    ).toBeTruthy();
  });
});
