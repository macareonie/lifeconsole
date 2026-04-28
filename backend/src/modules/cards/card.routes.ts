import { Router } from "express";
import {
  createNewCard,
  getCard,
  getCards,
  updateCard,
  deleteCard,
} from "./card.controller.js";

const cardsRouter = Router();

cardsRouter.post("/", createNewCard);
cardsRouter.get("/", getCards);
cardsRouter.get("/:id", getCard);
cardsRouter.put("/:id", updateCard);
cardsRouter.delete("/:id", deleteCard);

export default cardsRouter;
