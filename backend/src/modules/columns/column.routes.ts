import { Router } from "express";

import {
  createNewColumn,
  getColumns,
  getColumn,
  updateColumn,
  deleteColumn,
  getColumnsByBoardId,
} from "./column.controller.js";

const columnsRouter = Router();

columnsRouter.post("/", createNewColumn);
// similar to in cards, this endpoint retrieve all columns across all boards.
// can potentially see a use in the future, the filtered endpoint below is more suitable
columnsRouter.get("/", getColumns);
columnsRouter.get("/:id", getColumn);
columnsRouter.put("/:id", updateColumn);
columnsRouter.delete("/:id", deleteColumn);
// similar to in cards, this endpoint is the main endpoint to retrieve columns for a specific board
columnsRouter.get("/board/:boardId", getColumnsByBoardId);

export default columnsRouter;
