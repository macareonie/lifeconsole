import { describe, expect, it, vi } from "vitest";

import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";

import { useCardMutations } from "../../src/hooks/kanban/useCardMutations";
import { createCard, deleteCard, updateCard } from "../../src/services/cards";
import { createTestQueryClient } from "../test-utils";

import type { ReactNode } from "react";
vi.mock("../../src/services/cards", () => ({
  createCard: vi.fn(),
  updateCard: vi.fn(),
  deleteCard: vi.fn(),
}));

describe("useCardMutations", () => {
  it("invalidates boardContent after create/update/delete", async () => {
    // return an object containing boardId so the hook's onSuccess (which
    // currently reads the first arg) can access it
    vi.mocked(createCard).mockResolvedValue({ boardId: 9 });
    vi.mocked(updateCard).mockResolvedValue({ id: 11 });
    vi.mocked(deleteCard).mockResolvedValue({ boardId: 9 });

    const queryClient = createTestQueryClient();
    const invalidateQueries = vi.spyOn(queryClient, "invalidateQueries");
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useCardMutations(), { wrapper });

    await act(async () => {
      await result.current.createCardMutation.mutateAsync({
        board_id: 9,
        title: "Card",
        subtitle: "Sub",
        column_id: 3,
        position: 1,
        metadata: null,
      });
    });

    expect(
      (createCard as unknown as { mock: { calls: unknown[][] } }).mock
        .calls[0][0],
    ).toEqual({
      title: "Card",
      subtitle: "Sub",
      column_id: 3,
      position: 1,
      metadata: null,
    });
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["boardContent", 9],
    });

    await act(async () => {
      await result.current.updateCardMutation.mutateAsync({
        board_id: 9,
        card_id: 11,
        title: "Updated",
        subtitle: "S",
        column_id: 3,
        position: 2,
        metadata: null,
      });
    });

    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["boardContent", 9],
    });

    await act(async () => {
      await result.current.deleteCardMutation.mutateAsync({
        board_id: 9,
        card_id: 11,
      });
    });

    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["boardContent", 9],
    });
  });
});
