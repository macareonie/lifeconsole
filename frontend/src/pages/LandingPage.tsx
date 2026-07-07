import { CalendarCheck, LayoutDashboard } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

const LandingPage = () => {
  const { session } = useAuth();

  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center bg-background px-4 text-center text-foreground">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
            <span className="text-primary">life</span>console
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Personal productivity dashboard for your life. Track your tasks,
            habits, and goals all in one place.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 justify-center">
            <Link
              to={session ? "/board" : "/login"}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:opacity-90"
            >
              Get Started
            </Link>
            <a
              href="https://github.com/macareonie/lifeconsole/blob/main/docs/UserGuide.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm text-muted-foreground transition hover:border-foreground/40 hover:text-foreground"
            >
              <FaGithub className="h-4 w-4" />
              View User Guide
            </a>
          </div>
        </div>

        <div className="mb-10 h-px w-10 bg-border" />

        <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-3 flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-foreground">Project board</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Organize your tasks and data in a customizable kanban board.
              Simple drag-and-drop interface allows for easy management and
              prioritization of your data.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-3 flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-foreground">Habit tracker</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Track daily habits on a weekly grid, log your daily mood, and
              monitor streaks. Statistics and charts help you visualize your
              progress over time.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
