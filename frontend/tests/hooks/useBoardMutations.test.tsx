import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { useBoardMutations } from "../../src/hooks/kanban/useBoardMutations";
import {
  createBoard,
  deleteBoard,
  updateBoard,
} from "../../src/services/boards";
import { createTestQueryClient } from "../test-utils";

vi.mock("../../src/services/boards", () => ({
  createBoard: vi.fn(),
  updateBoard: vi.fn(),
  deleteBoard: vi.fn(),
}));

describe("useBoardMutations", () => {
  it("invalidates the boards query after creating a board", async () => {
    vi.mocked(createBoard).mockResolvedValue({ id: 1, title: "New board" });

    const queryClient = createTestQueryClient();
    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries");
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useBoardMutations(), { wrapper });

    await act(async () => {
      await result.current.createBoardMutation.mutateAsync("New board");
    });

    expect(
      (createBoard as unknown as { mock: { calls: unknown[][] } }).mock
        .calls[0][0],
    ).toBe("New board");
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ["boards"] });
  });

  it("invalidates board list and content after update and delete", async () => {
    vi.mocked(updateBoard).mockResolvedValue(3);
    vi.mocked(deleteBoard).mockResolvedValue(3);

    const queryClient = createTestQueryClient();
    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries");
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useBoardMutations(), { wrapper });

    await act(async () => {
      await result.current.updateBoardMutation.mutateAsync({
        board_id: 3,
        title: "Renamed board",
      });
    });

    await act(async () => {
      await result.current.deleteBoardMutation.mutateAsync(3);
    });

    expect(
      (updateBoard as unknown as { mock: { calls: unknown[][] } }).mock
        .calls[0][0],
    ).toBe(3);
    expect(
      (updateBoard as unknown as { mock: { calls: unknown[][] } }).mock
        .calls[0][1],
    ).toBe("Renamed board");
    expect(
      (deleteBoard as unknown as { mock: { calls: unknown[][] } }).mock
        .calls[0][0],
    ).toBe(3);
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ["boards"] });
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["boardContent", 3],
    });
  });
});
