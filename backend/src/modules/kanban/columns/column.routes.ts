import { Router } from "express";

import {
  createNewColumn,
  deleteColumn,
  updateColumn,
} from "./column.controller.js";

const columnsRouter = Router();

columnsRouter.post("/", createNewColumn);
columnsRouter.put("/:id", updateColumn);
columnsRouter.delete("/:id", deleteColumn);

export default columnsRouter;
