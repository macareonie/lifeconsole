import backendApi from "./http";

export const getMoodLog = async (moodlog_id: number) => {
  const { data } = await backendApi.get(`/moodlogs/${moodlog_id}/`);
  return data;
};

export const getMoodLogByDate = async (date: string) => {
  const { data } = await backendApi.get("/moodlogs/by-date/", {
    params: { date },
  });
  return data;
};

export const deleteMoodLog = async (moodlog_id: number) => {
  const { data } = await backendApi.delete(`/moodlogs/${moodlog_id}/`);
  return data;
};

export const setMoodLog = async (date: string, mood: string) => {
  const { data } = await backendApi.post("/moodlogs/", {
    date,
    mood,
  });
  return data;
};
