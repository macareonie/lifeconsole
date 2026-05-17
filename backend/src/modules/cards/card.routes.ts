import { Router } from "express";
import {
  createNewCard,
  getCard,
  getCards,
  updateCard,
  deleteCard,
  getCardsByBoardId,
} from "./card.controller.js";

const cardsRouter = Router();

cardsRouter.post("/", createNewCard);
// ---------------------------------------------------------------------------
// This returns all cards in order of creation across all columns and boards.
// Not sure how useful it is for actual frontend use, but kept in for now
cardsRouter.get("/", getCards);
// ---------------------------------------------------------------------------
cardsRouter.get("/:id", getCard);
cardsRouter.put("/:id", updateCard);
cardsRouter.delete("/:id", deleteCard);
// This is the main endpoint for querying card content on the frontend for a single board
cardsRouter.get("/board/:boardId", getCardsByBoardId);

export default cardsRouter;
