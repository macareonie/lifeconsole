import { db } from "../../config/db.js";
import { camelToSnake, snakeToCamel } from "../../utils/case-convert.js";

import type { ColumnUpdate } from "../../types/kanban.js";

export const addColumn = async (columnData: ColumnUpdate) => {
  const { error } = await db.from("columns").insert(camelToSnake(columnData));
  return { error };
};

export const getColumnById = async (id: number) => {
  const { data, error } = await db
    .from("columns")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return { data: snakeToCamel(data), error };
};

export const updateColumnById = async (
  id: number,
  updates: Partial<ColumnUpdate>,
) => {
  const { error } = await db
    .from("columns")
    .update(camelToSnake(updates))
    .eq("id", id);
  return { error };
};

export const deleteColumnById = async (id: number) => {
  const { error } = await db.from("columns").delete().eq("id", id);
  return { error };
};

export const getColumnsByBoardId = async (boardId: number) => {
  const { data, error } = await db
    .from("columns")
    .select("*")
    .eq("board_id", boardId);
  return { data: data?.map(snakeToCamel), error };
};
