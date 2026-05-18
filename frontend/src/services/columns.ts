import backendApi from "./http";

export const getColumnsFromBoardId = async (boardId: number) => {
  const { data } = await backendApi.get(`/columns/board/${boardId}/`);
  return data.data;
};
