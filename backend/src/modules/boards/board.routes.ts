import { Router } from "express";
import { body } from "express-validator";
import validateInputs from "../../utils/input-validation.js";
import {
  createNewBoard,
  getBoard,
  getBoards,
  updateBoard,
  deleteBoard,
} from "./board.controller.js";

const boardsRouter = Router();

const validateTitleParam = [
  body("title").notEmpty().withMessage("Title is required"),
];

boardsRouter.post("/", validateInputs(validateTitleParam), createNewBoard);
boardsRouter.get("/", getBoards);
boardsRouter.get("/:id", getBoard);
boardsRouter.put("/:id", validateInputs(validateTitleParam), updateBoard);
boardsRouter.delete("/:id", deleteBoard);

export default boardsRouter;
