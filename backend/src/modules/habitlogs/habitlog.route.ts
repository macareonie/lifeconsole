import { Router } from "express";

import {
  addHabitLog,
  deleteHabitLog,
  getAllLogsByHabitId,
  getHabitLog,
  getHabitLogsByDateRange,
  toggleHabitLog,
  updateHabitLog,
} from "./habitlog.controller.js";

const habitLogRouter = Router();

habitLogRouter.post("/", addHabitLog);
habitLogRouter.post("/toggle/", toggleHabitLog);
habitLogRouter.get("/:id", getHabitLog);
habitLogRouter.get("/habit/:habit_id", getAllLogsByHabitId);
habitLogRouter.get("/range/", getHabitLogsByDateRange);
habitLogRouter.put("/:id", updateHabitLog);
habitLogRouter.delete("/:id", deleteHabitLog);

export default habitLogRouter;
