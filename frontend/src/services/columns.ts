import backendApi from "./http";

export const getColumnsFromBoardId = async (board_id: number) => {
  const { data } = await backendApi.get(`/columns/board/${board_id}/`);
  return data.data;
};

export const createColumn = async ({
  title,
  board_id,
  position,
}: {
  title: string;
  board_id: number;
  position: number;
}) => {
  const { data } = await backendApi.post("/columns/", {
    title,
    board_id,
    position,
  });
  return data;
};

export const updateColumn = async ({
  column_id,
  title,
  position,
}: {
  column_id: number;
  title: string;
  position: number;
}) => {
  const { data } = await backendApi.put(`/columns/${column_id}/`, {
    title,
    position,
  });
  return data;
};

export const deleteColumn = async (column_id: number) => {
  const { data } = await backendApi.delete(`/columns/${column_id}/`);
  return data;
};
