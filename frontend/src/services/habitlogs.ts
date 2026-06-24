import backendApi from "./http";

// export const getHabitLog = async (habitlog_id: number) => {
//   const { data } = await backendApi.get(`/habitlogs/${habitlog_id}/`);
//   return data;
// };

export const getHabitLogsByDateRange = async (
  start_date: string,
  end_date: string,
) => {
  const { data } = await backendApi.get("/habitlogs/range/", {
    params: {
      start_date,
      end_date,
    },
  });
  return data;
};

export const toggleHabitLog = async (habit_id: number, date: string) => {
  const { data } = await backendApi.post("/habitlogs/toggle/", {
    habit_id,
    date,
  });
  return data;
};

export const getAllLogsByHabitId = async (habit_id: number) => {
  const { data } = await backendApi.get(`/habitlogs/habit/${habit_id}/`);
  return data;
};

export const deleteHabitLog = async (habitlog_id: number) => {
  const { data } = await backendApi.delete(`/habitlogs/${habitlog_id}/`);
  return data;
};
