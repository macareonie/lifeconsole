import { Router } from "express";

import {
  deleteHabitLog,
  getAllLogsByHabitId,
  getHabitLogsByDateRange,
  toggleHabitLog,
} from "./habitlog.controller.js";

const habitLogRouter = Router();

habitLogRouter.post("/toggle/", toggleHabitLog);
// habitLogRouter.get("/:id", getHabitLog);
habitLogRouter.get("/habit/:habit_id", getAllLogsByHabitId);
habitLogRouter.get("/range/", getHabitLogsByDateRange);
habitLogRouter.delete("/:id", deleteHabitLog);

export default habitLogRouter;
