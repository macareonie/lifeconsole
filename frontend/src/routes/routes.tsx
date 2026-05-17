// src/routes/routes.tsx
import type { RouteObject } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import RequireAuth from "./RequireAuth";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import BoardPage from "../pages/BoardPage";
import ErrorPage from "../pages/ErrorPage";
import BoardListPage from "../pages/BoardListPage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        element: <RequireAuth />,
        children: [
          {
            path: "board",
            children: [
              {
                index: true,
                element: <BoardListPage />,
              },
              {
                path: ":id",
                element: <BoardPage />,
              },
            ],
          },
        ],
      },
    ],
  },
];

export default routes;
