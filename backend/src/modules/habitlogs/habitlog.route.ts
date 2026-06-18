import { Router } from 'express';

import {
    addHabitLog, deleteHabitLog, getAllLogsByHabitId, getHabitLog, updateHabitLog
} from './habitlog.controller.js';

const habitLogRouter = Router();

habitLogRouter.post("/", addHabitLog);
habitLogRouter.get("/:id", getHabitLog);
habitLogRouter.get("/habit/:habit_id", getAllLogsByHabitId);
habitLogRouter.put("/:id", updateHabitLog);
habitLogRouter.delete("/:id", deleteHabitLog);

export default habitLogRouter;
