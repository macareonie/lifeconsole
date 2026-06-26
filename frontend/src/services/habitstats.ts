import backendApi from "./http";

export const getAllTimeStats = async () => {
  const { data } = await backendApi.get("/habitstats/all-time/");
  return data.data;
};
