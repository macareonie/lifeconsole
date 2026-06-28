import { db } from "../../config/db.js";
import { snakeToCamel } from "../../utils/case-convert.js";

export const addBoard = async (title: string, userId: number) => {
  const { error } = await db.from("boards").insert({
    title: title,
    user_id: userId,
  });
  return { error };
};

export const getBoardById = async (id: number) => {
  const { data, error } = await db
    .from("boards")
    .select("id, title")
    .eq("id", id)
    .maybeSingle();
  return { data: data ? snakeToCamel(data) : null, error };
};

export const getAllBoards = async () => {
  const { data, error } = await db.from("boards").select("id, title");
  return { data: data?.map(snakeToCamel), error };
};

export const updateBoardById = async (
  id: number,
  updates: Partial<{ title: string }>,
) => {
  const { error } = await db.from("boards").update(updates).eq("id", id);
  return { error };
};

export const deleteBoardById = async (id: number) => {
  const { error } = await db.from("boards").delete().eq("id", id);
  return { error };
};
