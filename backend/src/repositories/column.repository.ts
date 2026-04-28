import { db } from "../config/db.js";

export const addColumn = async (
  title: string,
  boardId: number,
  position: number,
) => {
  const { data, error } = await db.from("columns").insert({
    title: title,
    board_id: boardId,
    position: position,
  });
  return { data, error };
};

export const getColumnById = async (id: number) => {
  const { data, error } = await db
    .from("columns")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return { data, error };
};

export const getAllColumns = async () => {
  const { data, error } = await db.from("columns").select("*");
  return { data, error };
};

export const updateColumnById = async (
  id: number,
  updates: Partial<{ title: string; position: number }>,
) => {
  const { data, error } = await db.from("columns").update(updates).eq("id", id);
  return { data, error };
};

export const deleteColumnById = async (id: number) => {
  const { data, error } = await db.from("columns").delete().eq("id", id);
  return { data, error };
};
