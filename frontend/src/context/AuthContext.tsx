import { createContext } from "react";
import { type Session } from "@supabase/supabase-js";

export type LoginInput = {
  username: string;
  password: string;
};

export type SignupInput = {
  email: string;
  username: string;
  password: string;
};

export type AuthContextType = {
  session: Session | null;
  login: (input: LoginInput) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
