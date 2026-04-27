import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import authRouter from "./modules/auth/auth.routes.js";
import boardsRouter from "./modules/boards/board.routes.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/boards", authMiddleware, boardsRouter);

app.get("/", (req, res) => {
  res.send("Landing page");
});

app.use(errorMiddleware);

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
