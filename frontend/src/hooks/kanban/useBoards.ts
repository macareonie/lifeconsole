import { useQuery } from "@tanstack/react-query";
import { getBoards } from "../../services/boards";
import { type BoardSummary } from "../../types/kanban";

export const useBoards = () => {
  return useQuery<BoardSummary[]>({
    queryKey: ["boards"],
    queryFn: getBoards,
  });
};
