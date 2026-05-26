import { Router } from "express";
import {
  createNewCard,
  getCard,
  updateCard,
  deleteCard,
  getCardsByBoardId,
} from "./card.controller.js";

const cardsRouter = Router();

cardsRouter.post("/", createNewCard);
cardsRouter.get("/:id", getCard);
cardsRouter.put("/:id", updateCard);
cardsRouter.delete("/:id", deleteCard);
// This is the main endpoint for querying card content on the frontend for a single board
cardsRouter.get("/board/:boardId", getCardsByBoardId);

export default cardsRouter;
