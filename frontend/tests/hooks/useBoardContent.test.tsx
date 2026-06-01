import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { useBoardContent } from "../../src/hooks/kanban/useBoardContent";
import { getBoard } from "../../src/services/boards";
import { getCardsFromBoardId } from "../../src/services/cards";
import { getColumnsFromBoardId } from "../../src/services/columns";
import { createTestQueryClient } from "../test-utils";

vi.mock("../../src/services/boards", () => ({
  getBoard: vi.fn(),
}));

vi.mock("../../src/services/columns", () => ({
  getColumnsFromBoardId: vi.fn(),
}));

vi.mock("../../src/services/cards", () => ({
  getCardsFromBoardId: vi.fn(),
}));

describe("useBoardContent", () => {
  it("merges board, columns, and sorted cards", async () => {
    vi.mocked(getBoard).mockResolvedValue({ id: 4, title: "Product plan" });
    vi.mocked(getColumnsFromBoardId).mockResolvedValue([
      { id: 10, title: "Doing", position: 2 },
      { id: 5, title: "To do", position: 1 },
    ]);
    vi.mocked(getCardsFromBoardId).mockResolvedValue([
      { id: 101, column_id: 10, title: "Later card", position: 2 },
      { id: 102, column_id: 10, title: "First card", position: 1 },
      { id: 103, column_id: 5, title: "Backlog item", position: 1 },
    ]);

    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useBoardContent(4), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getBoard).toHaveBeenCalledWith(4);
    expect(getColumnsFromBoardId).toHaveBeenCalledWith(4);
    expect(getCardsFromBoardId).toHaveBeenCalledWith(4);
    expect(result.current.data?.columns[0].cards).toEqual([
      { id: 102, column_id: 10, title: "First card", position: 1 },
      { id: 101, column_id: 10, title: "Later card", position: 2 },
    ]);
  });
});
