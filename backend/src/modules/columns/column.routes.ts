import { Router } from "express";

import {
  createNewColumn,
  getColumn,
  updateColumn,
  deleteColumn,
  getColumnsByBoardId,
} from "./column.controller.js";

const columnsRouter = Router();

columnsRouter.post("/", createNewColumn);
columnsRouter.get("/:id", getColumn);
columnsRouter.put("/:id", updateColumn);
columnsRouter.delete("/:id", deleteColumn);
// similar to in cards, this endpoint is the main endpoint to retrieve columns for a specific board
columnsRouter.get("/board/:board_id", getColumnsByBoardId);

export default columnsRouter;
