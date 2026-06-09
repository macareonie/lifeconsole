import { db } from "../config/db.js";
import type { JsonValue } from "../types/json.ts";

export const addCard = async (
  title: string,
  subtitle: string,
  columnId: number,
  position: number,
  metadata: JsonValue,
) => {
  const { data: result, error } = await db.from("cards").insert({
    title: title,
    subtitle: subtitle,
    column_id: columnId,
    position: position,
    metadata: metadata,
  });
  return { data: result, error };
};

export const getCardById = async (id: number) => {
  const { data, error } = await db
    .from("cards")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return { data, error };
};

export const updateCardById = async (
  id: number,
  updates: Partial<{
    title: string;
    column_id: number;
    position: number;
    subtitle: string;
    metadata: JsonValue;
  }>,
) => {
  const { data, error } = await db.from("cards").update(updates).eq("id", id);
  return { data, error };
};

export const deleteCardById = async (id: number) => {
  const { data, error } = await db.from("cards").delete().eq("id", id);
  return { data, error };
};

export const getCardsByBoardId = async (boardId: number) => {
  const { data, error } = await db
    .from("cards")
    .select("*, columns!inner(*)")
    .eq("columns.board_id", boardId);
  return { data, error };
};
