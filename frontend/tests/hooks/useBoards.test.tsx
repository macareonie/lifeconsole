import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { useBoards } from "../../src/hooks/kanban/useBoards";
import { getBoards } from "../../src/services/boards";
import { createTestQueryClient } from "../test-utils";

vi.mock("../../src/services/boards", () => ({
  getBoards: vi.fn(),
}));

describe("useBoards", () => {
  it("fetches board summaries", async () => {
    const boards = [
      { id: 1, title: "One" },
      { id: 2, title: "Two" },
    ];

    vi.mocked(getBoards).mockResolvedValue(boards);

    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useBoards(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(boards);
    expect(getBoards).toHaveBeenCalled();
  });
});
