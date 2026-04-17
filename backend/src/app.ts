import express from "express";
import { env } from "./config/env.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
