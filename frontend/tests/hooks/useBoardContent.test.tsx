import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { useBoardContent } from "../../src/hooks/kanban/useBoardContent";
import { getBoardContent } from "../../src/services/boards";
import { createTestQueryClient } from "../test-utils";

vi.mock("../../src/services/boards", () => ({
  getBoardContent: vi.fn(),
}));

describe("useBoardContent", () => {
  it("merges board, columns, and sorted cards", async () => {
    vi.mocked(getBoardContent).mockResolvedValue({
      id: 4,
      title: "Product plan",
      columns: [
        { id: 5, title: "To do", position: 1, cards: [] },
        {
          id: 10,
          title: "Doing",
          position: 2,
          cards: [
            { id: 101, column_id: 10, title: "Later card", position: 1 },
            { id: 102, column_id: 10, title: "First card", position: 2 },
          ],
        },
      ],
    });

    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useBoardContent(1), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getBoardContent).toHaveBeenCalledWith(1);
    expect(result.current.data).toBeDefined();

    expect(result.current.data).toEqual({
      id: 4,
      title: "Product plan",
      columns: [
        { id: 5, title: "To do", position: 1, cards: [] },
        {
          id: 10,
          title: "Doing",
          position: 2,
          cards: [
            { id: 101, column_id: 10, title: "Later card", position: 1 },
            { id: 102, column_id: 10, title: "First card", position: 2 },
          ],
        },
      ],
    });
  });
});
