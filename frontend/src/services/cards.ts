import backendApi from "./http";
import type { JsonValue } from "../types/json.ts";

export const getCardsFromBoardId = async (boardId: number) => {
  const { data } = await backendApi.get(`/cards/board/${boardId}/`);
  return data.data;
};

export const createCard = async ({
  title,
  subtitle,
  columnId,
  position,
  metadata,
}: {
  title: string;
  subtitle: string;
  columnId: number;
  position: number;
  metadata: JsonValue;
}) => {
  const { data } = await backendApi.post("/cards/", {
    title,
    subtitle,
    columnId,
    position,
    metadata,
  });
  return data;
};

export const updateCard = async ({
  cardId,
  title,
  subtitle,
  columnId,
  position,
  metadata,
}: {
  cardId: number;
  title: string;
  subtitle: string;
  columnId: number;
  position: number;
  metadata: JsonValue;
}) => {
  const { data } = await backendApi.put(`/cards/${cardId}/`, {
    title,
    subtitle,
    columnId,
    position,
    metadata,
  });
  return data;
};

export const deleteCard = async (cardId: number) => {
  const { data } = await backendApi.delete(`/cards/${cardId}/`);
  return data;
};
