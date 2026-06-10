import backendApi from "./http";

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

export const deleteBoard = async (board_id: number) => {
  const { data } = await backendApi.delete(`/boards/${board_id}/`);
  return data;
};
