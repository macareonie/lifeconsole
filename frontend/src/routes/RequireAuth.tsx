import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

const RequireAuth = () => {
  const { session, isLoading } = useAuth();

  // Wait for the cookie-backed session bootstrap before redirecting.
  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
