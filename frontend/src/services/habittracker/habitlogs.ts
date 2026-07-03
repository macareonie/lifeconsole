import backendApi from "../http";

export const getHabitLogsByDateRange = async (
  startDate: string,
  endDate: string,
) => {
  const { data } = await backendApi.get("/habitlogs/range/", {
    params: {
      startDate,
      endDate,
    },
  });
  return data;
};

export const toggleHabitLog = async (habitId: number, date: string) => {
  const { data } = await backendApi.post("/habitlogs/toggle/", {
    habitId,
    date,
  });
  return data;
};
