import { Link } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

const LandingPage = () => {
  const { session } = useAuth();

  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center bg-background px-4 text-center text-foreground">
        <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
          Welcome to <span className="text-primary">life</span>console
        </h1>
        <p className="text-lg text-muted-foreground mb-4">
          Your all-in-one life management dashboard
        </p>
        <Link
          to={session ? "/board" : "/login"}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:opacity-90"
        >
          Get Started
        </Link>
      </div>
    </>
  );
};

export default LandingPage;
