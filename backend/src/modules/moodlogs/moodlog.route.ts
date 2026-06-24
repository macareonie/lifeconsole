import { Router } from "express";

import {
  deleteMoodLog,
  getMoodLog,
  getMoodLogByDate,
  setMoodLog,
} from "./moodlog.controller.js";

const moodLogsRouter = Router();

moodLogsRouter.get("/:id", getMoodLog);
moodLogsRouter.post("/by-date", getMoodLogByDate);
moodLogsRouter.delete("/:id", deleteMoodLog);
moodLogsRouter.post("/", setMoodLog);

export default moodLogsRouter;
