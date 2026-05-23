import { useEffect, useState, type ReactNode } from "react";
import { type Session } from "@supabase/supabase-js";
import { AuthContext, type LoginInput, type SignupInput } from "./AuthContext";
import backendApi from "../services/http";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const { data } = await backendApi.get("/auth/session");
        if (isMounted) {
          setSession(data.session ?? null);
        }
      } catch {
        if (isMounted) {
          setSession(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async ({ username, password }: LoginInput) => {
    const { data } = await backendApi.post("/auth/login", {
      username,
      password,
    });

    setSession(data.session ?? null);
  };

  const signup = async ({ email, username, password }: SignupInput) => {
    const { data } = await backendApi.post("/auth/register", {
      email,
      username,
      password,
    });

    setSession(data.session ?? null);
  };

  const logout = async () => {
    await backendApi.post("/auth/logout");
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
