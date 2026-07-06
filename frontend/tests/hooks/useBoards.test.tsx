import { describe, expect, it, vi } from "vitest";

import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";

import { useBoards } from "../../src/hooks/kanban/useBoards";
import { getBoards } from "../../src/services/kanban/boards";
import { createTestQueryClient } from "../test-utils";

import type { ReactNode } from "react";
vi.mock("../../src/services/kanban/boards", () => ({
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
