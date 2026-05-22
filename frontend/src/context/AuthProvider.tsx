import { useEffect, useState, useMemo, type ReactNode } from "react";
import { type Session } from "@supabase/supabase-js";
import { AuthContext, type LoginInput, type SignupInput } from "./AuthContext";

const SESSION_STORAGE_KEY = "authSession";

const clearStoredSession = () => {
  localStorage.removeItem(SESSION_STORAGE_KEY);
};

const isSessionExpired = (session: Session | null) => {
  if (!session?.expires_at) {
    return true;
  }
  return session.expires_at * 1000 <= Date.now();
};

const persistSession = (session: Session | null) => {
  if (!session || isSessionExpired(session)) {
    clearStoredSession();
    return;
  }
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
};

const readStoredSession = (): Session | null => {
  if (typeof window === "undefined") {
    return null;
  }
  const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!storedSession) {
    return null;
  }
  try {
    const parsedSession = JSON.parse(storedSession) as Session;
    if (isSessionExpired(parsedSession)) {
      clearStoredSession();
      return null;
    }
    return parsedSession;
  } catch {
    clearStoredSession();
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(() =>
    readStoredSession(),
  );

  const activeSession = useMemo(() => {
    if (!session || isSessionExpired(session)) {
      return null;
    }
    return session;
  }, [session]);

  useEffect(() => {
    persistSession(activeSession);
  }, [activeSession]);

  useEffect(() => {
    if (!session?.expires_at) {
      return;
    }
    const remainingMs = session.expires_at * 1000 - Date.now();
    if (remainingMs <= 0) {
      return;
    }

    const timeoutId = setTimeout(() => {
      clearStoredSession();
      setSession(null);
    }, remainingMs);

    return () => clearTimeout(timeoutId);
  }, [session?.expires_at]);

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
