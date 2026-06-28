import type { JsonValue } from "./json.js";

export type Card = {
  id: number;
  columnId: number;
  title: string;
  subtitle?: string;
  metadata?: JsonValue;
  position: number;
};

export type CardUpdate = {
  columnId?: number;
  title?: string;
  subtitle?: string;
  metadata?: JsonValue;
  position?: number;
};

export type Column = {
  id: number;
  title: string;
  position: number;
  cards: Card[];
};

export type ColumnUpdate = {
  boardId?: number;
  title?: string;
  position?: number;
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
