import { Router } from "express";

import { createNewCard, deleteCard, updateCard } from "./card.controller.js";

const cardsRouter = Router();

cardsRouter.post("/", createNewCard);
cardsRouter.put("/:id", updateCard);
cardsRouter.delete("/:id", deleteCard);

export default cardsRouter;
