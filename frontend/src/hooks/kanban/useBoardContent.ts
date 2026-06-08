import { useQuery } from "@tanstack/react-query";
import { getBoardContent } from "@/services/boards";

import type { BoardContent } from "../../types/kanban";

async function fetchBoardContent(boardId: number): Promise<BoardContent> {
  const boardContent = await getBoardContent(boardId);
  return boardContent;
}

export const useBoardContent = (boardId: number) => {
  return useQuery<BoardContent>({
    queryKey: ["boardContent", boardId],
    queryFn: () => fetchBoardContent(boardId),
    enabled: !!boardId,
  });
};
