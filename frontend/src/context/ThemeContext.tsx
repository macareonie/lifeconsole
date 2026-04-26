import { createContext } from "react";

export type ThemeContextType = {
  theme: boolean;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);
