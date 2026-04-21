import { useState, type ReactNode } from "react";
import { type Session } from "@supabase/supabase-js";
import { AuthContext, type LoginInput, type SignupInput } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);

  const login = async ({ username, password }: LoginInput) => {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to login");
    }

    setSession(data.session);
  };

  const signup = async ({ email, username, password }: SignupInput) => {
    const response = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to signup");
    }

    setSession(data.session);
  };

  const logout = () => {
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
