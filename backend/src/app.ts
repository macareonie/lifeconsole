import express from "express";
import { env } from "./config/env.js";
import authRouter from "./modules/auth/auth.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();
app.use(express.json());

app.use("/auth", authRouter);
app.use(errorMiddleware);

app.get("/test", (req, res) => {
  res.send("Test endpoint");
});
app.get("/", (req, res) => {
  res.send("Landing page");
});

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
