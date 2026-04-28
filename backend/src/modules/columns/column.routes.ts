import { Router } from "express";

import {
  createNewColumn,
  getColumns,
  getColumn,
  updateColumn,
  deleteColumn,
} from "./column.controller.js";

const columnsRouter = Router();

columnsRouter.post("/", createNewColumn);
columnsRouter.get("/", getColumns);
columnsRouter.get("/:id", getColumn);
columnsRouter.put("/:id", updateColumn);
columnsRouter.delete("/:id", deleteColumn);

export default columnsRouter;
