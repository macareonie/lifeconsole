import { db } from "../../config/db.js";

export const addBoard = async (title: string, userId: number) => {
  const { data, error } = await db.from("boards").insert({
    title: title,
    user_id: userId,
  });
  return { data, error };
};

export const getBoardById = async (id: number) => {
  const { data, error } = await db
    .from("boards")
    .select("id, title")
    .eq("id", id)
    .maybeSingle();
  return { data, error };
};

export const getAllBoards = async () => {
  const { data, error } = await db.from("boards").select("id, title");
  return { data, error };
};

export const updateBoardById = async (
  id: number,
  updates: Partial<{ title: string }>,
) => {
  const { data, error } = await db.from("boards").update(updates).eq("id", id);
  return { data, error };
};

export const deleteBoardById = async (id: number) => {
  const { data, error } = await db.from("boards").delete().eq("id", id);
  return { data, error };
};
