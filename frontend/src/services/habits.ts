import backendApi from "./http";

export const addHabit = async (title: string, frequency: string) => {
  const { data } = await backendApi.post("/habits/", { title, frequency });
  return data.data;
};

export const getAllUserHabits = async () => {
  const { data } = await backendApi.get("/habits/");
  return data.data;
};

export const updateHabit = async (
  id: number,
  title: string,
  frequency: string,
) => {
  const { data } = await backendApi.put(`/habits/${id}/`, { title, frequency });
  return data.data;
};

export const deleteHabit = async (id: number) => {
  const { data } = await backendApi.delete(`/habits/${id}/`);
  return data.data;
};
