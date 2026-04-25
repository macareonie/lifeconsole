import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const NavBar = () => {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <NavLink to="/" className="font-bold text-2xl">
            lifeconsole
          </NavLink>
          <div className="flex items-center gap-6">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/board">Board</NavLink>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <NavLink to="/board">Board</NavLink>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
