import { useQuery } from "@tanstack/react-query";

import { getBoards } from "../../services/kanban/boards";

import type { BoardSummary } from "../../types/kanban";

export const useBoards = () => {
  return useQuery<BoardSummary[]>({
    queryKey: ["boards"],
    queryFn: getBoards,
  });
};
