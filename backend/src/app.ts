import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import authRouter from "./modules/auth/auth.routes.js";
import boardsRouter from "./modules/boards/board.routes.js";
import columnsRouter from "./modules/columns/column.routes.js";
import cardsRouter from "./modules/cards/card.routes.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

app.use(
  cors({
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    origin: env.FRONTEND_DEV_URL,
  }),
);
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/boards", authMiddleware, boardsRouter);
app.use("/api/columns", authMiddleware, columnsRouter);
app.use("/api/cards", authMiddleware, cardsRouter);

app.get("/", (req, res) => {
  res.send("Landing page");
});

app.use(errorMiddleware);

export default app;
