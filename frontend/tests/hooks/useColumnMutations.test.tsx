import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { useColumnMutations } from "../../src/hooks/kanban/useColumnMutations";
import {
  createColumn,
  updateColumn,
  deleteColumn,
} from "../../src/services/columns";
import { createTestQueryClient } from "../test-utils";

vi.mock("../../src/services/columns", () => ({
  createColumn: vi.fn(),
  updateColumn: vi.fn(),
  deleteColumn: vi.fn(),
}));

describe("useColumnMutations", () => {
  it("invalidates boardContent after create/update/delete", async () => {
    // mock service to return the boardId so onSuccess receives it
    vi.mocked(createColumn).mockResolvedValue(7);
    vi.mocked(updateColumn).mockResolvedValue(7);
    vi.mocked(deleteColumn).mockResolvedValue(7);

    const queryClient = createTestQueryClient();
    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries");
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useColumnMutations(), { wrapper });

    await act(async () => {
      await result.current.createColumnMutation.mutateAsync({
        title: "New col",
        boardId: 7,
        position: 1,
      });
    });

    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["boardContent", 7],
    });

    await act(async () => {
      await result.current.updateColumnMutation.mutateAsync({
        columnId: 5,
        boardId: 7,
        title: "Renamed",
        position: 2,
      });
    });

    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["boardContent", 7],
    });

    await act(async () => {
      await result.current.deleteColumnMutation.mutateAsync({
        columnId: 5,
        boardId: 7,
      });
    });

    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["boardContent", 7],
    });
  });
});
