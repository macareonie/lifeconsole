import backendApi from "../http";

export const createColumn = async ({
  title,
  boardId,
  position,
}: {
  title: string;
  boardId: number;
  position: number;
}) => {
  const { data } = await backendApi.post("/columns/", {
    title,
    boardId,
    position,
  });
  return data;
};

export const updateColumn = async ({
  columnId,
  title,
  position,
}: {
  columnId: number;
  title: string;
  position: number;
}) => {
  const { data } = await backendApi.put(`/columns/${columnId}/`, {
    title,
    position,
  });
  return data;
};

export const deleteColumn = async (columnId: number) => {
  const { data } = await backendApi.delete(`/columns/${columnId}/`);
  return data;
};
