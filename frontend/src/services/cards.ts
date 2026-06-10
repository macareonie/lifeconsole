import backendApi from "./http";
import type { JsonValue } from "../types/json.ts";

export const getCardsFromBoardId = async (board_id: number) => {
  const { data } = await backendApi.get(`/cards/board/${board_id}/`);
  return data.data;
};

export const createCard = async ({
  title,
  subtitle,
  column_id,
  position,
  metadata,
}: {
  title: string;
  subtitle: string;
  column_id: number;
  position: number;
  metadata: JsonValue;
}) => {
  const { data } = await backendApi.post("/cards/", {
    title,
    subtitle,
    column_id,
    position,
    metadata,
  });
  return data;
};

export const updateCard = async ({
  card_id,
  title,
  subtitle,
  column_id,
  position,
  metadata,
}: {
  card_id: number;
  title: string;
  subtitle: string;
  column_id: number;
  position: number;
  metadata: JsonValue;
}) => {
  const { data } = await backendApi.put(`/cards/${card_id}/`, {
    title,
    subtitle,
    column_id,
    position,
    metadata,
  });
  return data;
};

export const deleteCard = async (card_id: number) => {
  const { data } = await backendApi.delete(`/cards/${card_id}/`);
  return data;
};
