import backendApi from "./http";

export const getBoards = async () => {
  const { data } = await backendApi.get("/boards/");
  return data.data;
};

export const getBoard = async (boardId: number) => {
  const { data } = await backendApi.get(`/boards/${boardId}/`);
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

export const deleteBoard = async (boardId: number) => {
  const { data } = await backendApi.delete(`/boards/${boardId}/`);
  return data;
};
