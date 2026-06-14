import backendApi from "./http";

import type { updateLayoutBody } from "@/hooks/kanban/useBoardMutations";

export const getBoards = async () => {
  const { data } = await backendApi.get("/boards/");
  return data.data;
};

export const getBoard = async (board_id: number) => {
  const { data } = await backendApi.get(`/boards/${board_id}/`);
  return data.data;
};

export const getBoardContent = async (board_id: number) => {
  const { data } = await backendApi.get(`/boards/${board_id}/content/`);
  return data.data;
};

export const createBoard = async (title: string) => {
  const { data } = await backendApi.post("/boards/", { title });
  return data;
};

export const updateBoard = async (board_id: number, title: string) => {
  const { data } = await backendApi.put(`/boards/${board_id}/`, { title });
  return data;
};

export const updateBoardLayout = async (
  board_id: number,
  layout: updateLayoutBody,
) => {
  const { data } = await backendApi.put(`/boards/${board_id}/layout/`, {
    layout,
  });
  return data;
};

export const deleteBoard = async (board_id: number) => {
  const { data } = await backendApi.delete(`/boards/${board_id}/`);
  return data;
};
