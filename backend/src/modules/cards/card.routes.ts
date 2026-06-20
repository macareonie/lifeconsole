import { Router } from "express";

import {
  createNewCard,
  deleteCard,
  getCard,
  getCardsByBoardId,
  updateCard,
} from "./card.controller.js";

const cardsRouter = Router();

cardsRouter.post("/", createNewCard);
cardsRouter.get("/:id", getCard);
cardsRouter.put("/:id", updateCard);
cardsRouter.delete("/:id", deleteCard);
// This is the main endpoint for querying card content on the frontend for a single board
cardsRouter.get("/board/:board_id", getCardsByBoardId);

export default cardsRouter;
