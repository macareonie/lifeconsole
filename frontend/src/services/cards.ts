import backendApi from "./http";

export const getCardsFromBoardId = async (boardId: number) => {
  const { data } = await backendApi.get(`/cards/board/${boardId}/`);
  return data;
};
