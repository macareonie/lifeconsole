import type { ReactElement, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import {
  MemoryRouter,
  createMemoryRouter,
  RouterProvider,
} from "react-router-dom";

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

type RenderOptions = {
  route?: string;
  queryClient?: QueryClient;
};

type RenderRouteOptions = {
  route: string;
  path: string;
  queryClient?: QueryClient;
};

export function renderWithProviders(
  ui: ReactElement,
  { route = "/", queryClient = createTestQueryClient() }: RenderOptions = {},
) {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[route]}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  );

  return {
    queryClient,
    ...render(ui, { wrapper: Wrapper }),
  };
}

export function renderWithRouter(
  ui: ReactElement,
  { route, path, queryClient = createTestQueryClient() }: RenderRouteOptions,
) {
  const router = createMemoryRouter(
    [
      {
        path,
        element: ui,
      },
    ],
    { initialEntries: [route] },
  );

  const tree = (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );

  const rendered = render(tree);

  return {
    ...rendered,
    router,
    ui: tree,
    queryClient,
  };
}
