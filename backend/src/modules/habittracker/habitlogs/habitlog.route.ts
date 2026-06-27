import { Router } from "express";

import {
  getHabitLogsByDateRange,
  toggleHabitLog,
} from "./habitlog.controller.js";

const habitLogRouter = Router();

habitLogRouter.post("/toggle/", toggleHabitLog);
habitLogRouter.get("/range/", getHabitLogsByDateRange);

export default habitLogRouter;
