import backendApi from "./http";

export const getBoards = async () => {
  const { data } = await backendApi.get("/boards/");
  return data;
};
