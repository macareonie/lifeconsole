import { db } from "../../config/db.js";
import { camelToSnake, snakeToCamel } from "../../utils/case-convert.js";

import type { CardUpdate } from "../../types/kanban.js";

export const addCard = async (cardData: CardUpdate) => {
  const { error } = await db.from("cards").insert(camelToSnake(cardData));
  return { error };
};

export const getCardById = async (id: number) => {
  const { data, error } = await db
    .from("cards")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return { data: snakeToCamel(data), error };
};

export const updateCardById = async (
  id: number,
  updates: Partial<CardUpdate>,
) => {
  const { error } = await db
    .from("cards")
    .update(camelToSnake(updates))
    .eq("id", id);
  return { error };
};

export const deleteCardById = async (id: number) => {
  const { error } = await db.from("cards").delete().eq("id", id);
  return { error };
};

export const getCardsByBoardId = async (boardId: number) => {
  const { data, error } = await db
    .from("cards")
    .select("*, columns!inner(*)")
    .eq("columns.board_id", boardId);
  return { data: data?.map(snakeToCamel), error };
};
