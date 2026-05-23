import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { Moon, Sun } from "lucide-react";

const NavBar = () => {
  const { session, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/70">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <NavLink to="/" className="text-2xl font-bold tracking-tight">
            <span className="text-primary">life</span>console
          </NavLink>
          <div className="flex items-center gap-6">
            <NavLink
              to="/"
              className="text-muted-foreground transition hover:text-primary"
            >
              Home
            </NavLink>
            <NavLink
              to="/board"
              className="text-muted-foreground transition hover:text-primary"
            >
              Board
            </NavLink>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-primary"
            aria-label="Toggle theme"
          >
            {theme ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
          </button>
          {session ? (
            <>
              <button
                onClick={handleLogout}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-primary"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-primary"
            >
              Login
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
