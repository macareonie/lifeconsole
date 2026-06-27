import backendApi from "../http";

import type { updateLayoutBody } from "@/hooks/kanban/useBoardMutations";

export const getBoards = async () => {
  const { data } = await backendApi.get("/boards/");
  return data.data;
};

export const getBoardContent = async (boardId: number) => {
  const { data } = await backendApi.get(`/boards/${boardId}/content/`);
  return data.data;
};

export const createBoard = async (title: string) => {
  const { data } = await backendApi.post("/boards/", { title });
  return data;
};

export const updateBoard = async (boardId: number, title: string) => {
  const { data } = await backendApi.put(`/boards/${boardId}/`, { title });
  return data;
};

export const updateBoardLayout = async (
  boardId: number,
  layout: updateLayoutBody,
) => {
  const { data } = await backendApi.put(`/boards/${boardId}/layout/`, {
    layout,
  });
  return data;
};

export const deleteBoard = async (boardId: number) => {
  const { data } = await backendApi.delete(`/boards/${boardId}/`);
  return data;
};
