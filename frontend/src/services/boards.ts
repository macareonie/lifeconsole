import backendApi from "./http";

export const getBoards = async () => {
  const { data } = await backendApi.get("/boards/");
  return data.data;
};

export const getBoard = async (boardId: number) => {
  const { data } = await backendApi.get(`/boards/${boardId}/`);
  return data.data;
};
