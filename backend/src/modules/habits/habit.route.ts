import { Router } from 'express';

import {
    addHabit, deleteHabitById, getAllUserHabits, updateHabitById
} from './habit.controller.js';

const habitsRouter = Router();

habitsRouter.post("/", addHabit);
habitsRouter.get("/", getAllUserHabits);
habitsRouter.put("/:id", updateHabitById);
habitsRouter.delete("/:id", deleteHabitById);

export default habitsRouter;
