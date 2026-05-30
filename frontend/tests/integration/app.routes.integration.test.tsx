import type { Session } from "@supabase/supabase-js";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  AuthContext,
  type AuthContextType,
} from "../../src/context/AuthContext";
import { ThemeContext } from "../../src/context/ThemeContext";
import routes from "../../src/routes/routes";
import { createTestQueryClient } from "../test-utils";

const mockUseBoards = vi.fn();
const mockUseBoardMutations = vi.fn();
const mockUseBoardContent = vi.fn();
const mockUseColumnMutations = vi.fn();

vi.mock("../../src/hooks/kanban/useBoards", () => ({
  useBoards: () => mockUseBoards(),
}));

vi.mock("../../src/hooks/kanban/useBoardMutations", () => ({
  useBoardMutations: () => mockUseBoardMutations(),
}));

vi.mock("../../src/hooks/kanban/useBoardContent", () => ({
  useBoardContent: (boardId: number) => mockUseBoardContent(boardId),
}));

vi.mock("../../src/hooks/kanban/useColumnMutations", () => ({
  useColumnMutations: () => mockUseColumnMutations(),
}));

const authenticatedSession = {} as Session;

function renderAppAtRoute(
  initialEntry: string,
  authOverrides: Partial<AuthContextType> = {},
) {
  const authValue: AuthContextType = {
    session: null,
    isLoading: false,
    login: vi.fn(),
    signup: vi.fn(),
    logout: vi.fn(),
    ...authOverrides,
  };

  const queryClient = createTestQueryClient();
  const router = createMemoryRouter(routes, {
    initialEntries: [initialEntry],
  });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={{ theme: false, toggleTheme: vi.fn() }}>
        <AuthContext.Provider value={authValue}>
          {children}
        </AuthContext.Provider>
      </ThemeContext.Provider>
    </QueryClientProvider>
  );

  return render(<RouterProvider router={router} />, { wrapper: Wrapper });
}

beforeEach(() => {
  vi.clearAllMocks();

  mockUseBoards.mockReturnValue({
    data: [],
    isPending: false,
    isError: false,
    error: null,
  });

  mockUseBoardMutations.mockReturnValue({
    createBoardMutation: {
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
      isError: false,
      error: null,
    },
    updateBoardMutation: {
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
      isError: false,
      error: null,
    },
    deleteBoardMutation: {
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
      isError: false,
      error: null,
    },
  });

  mockUseColumnMutations.mockReturnValue({
    createColumnMutation: {
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
      isError: false,
      error: null,
    },
    updateColumnMutation: {
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
      isError: false,
      error: null,
    },
    deleteColumnMutation: {
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
      isError: false,
      error: null,
    },
  });

  mockUseBoardContent.mockReturnValue({
    data: null,
    isPending: false,
    isError: false,
    error: null,
  });
});

describe("App route integration", () => {
  it("redirects unauthenticated users from /board to login", async () => {
    renderAppAtRoute("/board", {
      session: null,
      isLoading: false,
    });

    expect(
      await screen.findByRole("heading", { name: /sign up/i }),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: /log in/i })).toBeTruthy();
  });

  it("lets authenticated users create a board on /board", async () => {
    const user = userEvent.setup();
    const createBoard = vi.fn().mockResolvedValue(undefined);

    mockUseBoards.mockReturnValue({
      data: [{ id: 1, title: "Sprint planning" }],
      isPending: false,
      isError: false,
      error: null,
    });

    mockUseBoardMutations.mockReturnValue({
      createBoardMutation: {
        mutateAsync: createBoard,
        isPending: false,
        isError: false,
        error: null,
      },
      updateBoardMutation: {
        mutateAsync: vi.fn().mockResolvedValue(undefined),
        isPending: false,
        isError: false,
        error: null,
      },
      deleteBoardMutation: {
        mutateAsync: vi.fn().mockResolvedValue(undefined),
        isPending: false,
        isError: false,
        error: null,
      },
    });

    renderAppAtRoute("/board", {
      session: authenticatedSession,
      isLoading: false,
    });

    expect(await screen.findByText(/sprint planning/i)).toBeTruthy();

    await user.type(screen.getByLabelText(/board title/i), "Roadmap");
    await user.click(screen.getByRole("button", { name: /create board/i }));

    expect(
      (createBoard as unknown as { mock: { calls: unknown[][] } }).mock
        .calls[0][0],
    ).toBe("Roadmap");
  });

  it("renders board details for authenticated users on /board/:id", async () => {
    mockUseBoardContent.mockReturnValue({
      data: {
        id: 99,
        title: "Engineering",
        columns: [],
      },
      isPending: false,
      isError: false,
      error: null,
    });

    renderAppAtRoute("/board/99", {
      session: authenticatedSession,
      isLoading: false,
    });

    expect(
      await screen.findByRole("heading", { name: /engineering/i }),
    ).toBeTruthy();
    expect(screen.getByText(/0 columns/i)).toBeTruthy();
  });
});
