import { Router } from "express";

import {
  deleteMoodLog,
  getMoodLogByDate,
  setMoodLog,
} from "./moodlog.controller.js";

const moodLogsRouter = Router();

// moodLogsRouter.get("/:id", getMoodLog);
moodLogsRouter.get("/date/:date", getMoodLogByDate);
moodLogsRouter.delete("/:id", deleteMoodLog);
moodLogsRouter.post("/", setMoodLog);

export default moodLogsRouter;
