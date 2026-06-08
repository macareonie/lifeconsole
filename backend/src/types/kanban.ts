import { type JsonValue } from "./json.js";

export type Card = {
  id: number;
  column_id: number;
  title: string;
  subtitle?: string;
  metadata?: JsonValue;
  position: number;
};

export type Column = {
  id: number;
  title: string;
  position: number;
  cards: Card[];
};

export type BoardSummary = {
  id: number;
  title: string;
};

export type BoardContent = {
  id: number;
  title: string;
  columns: Column[];
};
