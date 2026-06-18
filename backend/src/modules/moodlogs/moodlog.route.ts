import { Router } from 'express';

import {
    addMoodLog, deleteMoodLog, getMoodLog, getMoodLogByDate, updateMoodLog
} from './moodlog.controller.js';

const moodLogsRouter = Router();

moodLogsRouter.post("/", addMoodLog);
moodLogsRouter.get("/:id", getMoodLog);
moodLogsRouter.post("/by-date", getMoodLogByDate);
moodLogsRouter.put("/:id", updateMoodLog);
moodLogsRouter.delete("/:id", deleteMoodLog);

export default moodLogsRouter;
