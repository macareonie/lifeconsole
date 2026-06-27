import { getBoardContent } from "@/services/kanban/boards";
import { useQuery } from "@tanstack/react-query";

import type { BoardContent } from "../../types/kanban";

async function fetchBoardContent(board_id: number): Promise<BoardContent> {
  const boardContent = await getBoardContent(board_id);
  return boardContent;
}

export const useBoardContent = (board_id: number) => {
  return useQuery<BoardContent>({
    queryKey: ["boardContent", board_id],
    queryFn: () => fetchBoardContent(board_id),
    enabled: !!board_id,
  });
};
