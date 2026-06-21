import backendApi from "./http";

export const addMoodLog = async (date: string, mood: number) => {
  const { data } = await backendApi.post("/moodlogs/", { date, mood });
  return data;
};

export const getMoodLog = async (moodlog_id: number) => {
  const { data } = await backendApi.get(`/moodlogs/${moodlog_id}/`);
  return data;
};

export const getMoodLogByDate = async (date: string) => {
  const { data } = await backendApi.post("/moodlogs/by-date/", { date });
  return data;
};

export const updateMoodLog = async (
  moodlog_id: number,
  date: string,
  mood: number,
) => {
  const { data } = await backendApi.put(`/moodlogs/${moodlog_id}/`, {
    date,
    mood,
  });
  return data;
};

export const deleteMoodLog = async (moodlog_id: number) => {
  const { data } = await backendApi.delete(`/moodlogs/${moodlog_id}/`);
  return data;
};
