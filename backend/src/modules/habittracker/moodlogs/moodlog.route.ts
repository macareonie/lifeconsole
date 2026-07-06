import { Router } from "express";

import {
  getMoodLogByDate,
  getMoodLogByDateRange,
  setMoodLog,
} from "./moodlog.controller.js";

const moodLogsRouter = Router();

moodLogsRouter.get("/range/", getMoodLogByDateRange);
moodLogsRouter.post("/", setMoodLog);
moodLogsRouter.get("/date/:date", getMoodLogByDate);

export default moodLogsRouter;
