import { useQuery } from "@tanstack/react-query";
import { getBoard } from "@/services/boards";
import { getColumnsFromBoardId } from "@/services/columns";
import { getCardsFromBoardId } from "@/services/cards";
import type { BoardContent, Column, Card } from "../../types/kanban";

async function fetchBoardContent(boardId: number): Promise<BoardContent> {
  const [board, columns, cards] = await Promise.all([
    getBoard(boardId),
    getColumnsFromBoardId(boardId),
    getCardsFromBoardId(boardId),
  ]);

  console.log(cards);

  const columnsWithCards: Column[] = columns.map((column: Column) => ({
    ...column,
    cards: cards
      .filter((card: Card) => card.column_id === column.id)
      .sort((a: Card, b: Card) => a.position - b.position),
  }));

  console.log(columnsWithCards);

  return {
    ...board,
    columns: columnsWithCards,
  };
}

export const useBoardContent = (boardId: number) => {
  return useQuery<BoardContent>({
    queryKey: ["boardContent", boardId],
    queryFn: () => fetchBoardContent(boardId),
    enabled: !!boardId,
  });
};
