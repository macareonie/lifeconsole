import cors from "cors";
import express from "express";

import { env } from "./config/env.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import authRouter from "./modules/auth/auth.routes.js";
import habitLogsRouter from "./modules/habittracker/habitlogs/habitlog.route.js";
import habitsRouter from "./modules/habittracker/habits/habit.route.js";
import habitStatsRouter from "./modules/habittracker/habitstats/habitstats.route.js";
import moodLogsRouter from "./modules/habittracker/moodlogs/moodlog.route.js";
import boardsRouter from "./modules/kanban/boards/board.routes.js";
import cardsRouter from "./modules/kanban/cards/card.routes.js";
import columnsRouter from "./modules/kanban/columns/column.routes.js";

const app = express();

app.use(
  cors({
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    origin:
      env.FRONTEND_MODE === "prod"
        ? env.FRONTEND_PROD_URL
        : env.FRONTEND_DEV_URL,
  }),
);
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/boards", authMiddleware, boardsRouter);
app.use("/api/columns", authMiddleware, columnsRouter);
app.use("/api/cards", authMiddleware, cardsRouter);
app.use("/api/habits", authMiddleware, habitsRouter);
app.use("/api/habitlogs", authMiddleware, habitLogsRouter);
app.use("/api/moodlogs", authMiddleware, moodLogsRouter);
app.use("/api/habitstats", authMiddleware, habitStatsRouter);

app.get("/", (req, res) => {
  console.log("Received request at /");
  res.send("Landing page");
});

app.use(errorMiddleware);

export default app;
