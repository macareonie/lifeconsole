import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BoardPage from "../../src/pages/BoardPage";
import { renderWithRouter } from "../test-utils";

const mockUseBoardContent = vi.fn();
const mockBoardItem = vi.fn(({ board }: { board: { title: string } }) => (
  <div>Board: {board.title}</div>
));

beforeEach(() => {
  mockUseBoardContent.mockReturnValue({
    data: null,
    isPending: false,
    isError: false,
    error: null,
  });
});

vi.mock("../../src/hooks/kanban/useBoardContent", () => ({
  useBoardContent: (board_id: number) => mockUseBoardContent(board_id),
}));

vi.mock("../../src/components/board/BoardItem", () => ({
  BoardItem: (props: unknown) => mockBoardItem(props as never),
}));

function renderBoardPage(route: string) {
  const rendered = renderWithRouter(<BoardPage />, {
    path: "/board/:id",
    route,
  });

  return rendered;
}

describe("BoardPage", () => {
  it("shows invalid board id for a bad route param", () => {
    renderBoardPage("/board/not-a-number");

    expect(screen.getByText(/invalid board id/i)).toBeTruthy();
  });

  it("renders the loading state", () => {
    mockUseBoardContent.mockReturnValue({
      data: null,
      isPending: true,
      isError: false,
      error: null,
    });

    renderBoardPage("/board/42");

    expect(screen.getByText(/loading/i)).toBeTruthy();
  });

  it("renders the error state", () => {
    mockUseBoardContent.mockReturnValue({
      data: null,
      isPending: false,
      isError: true,
      error: new Error("failed to load board"),
    });

    renderBoardPage("/board/42");

    expect(screen.getByText(/error: failed to load board/i)).toBeTruthy();
  });

  it("renders the board content", () => {
    mockUseBoardContent.mockReturnValue({
      data: { id: 42, title: "Engineering", columns: [] },
      isPending: false,
      isError: false,
      error: null,
    });

    renderBoardPage("/board/42");

    expect(screen.getByText(/board: engineering/i)).toBeTruthy();
    expect(mockBoardItem).toHaveBeenCalled();
  });
});
