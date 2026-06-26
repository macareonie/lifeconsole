import backendApi from "./http";

export const getMoodLog = async (moodlog_id: number) => {
  const { data } = await backendApi.get(`/moodlogs/${moodlog_id}/`);
  return data;
};

export const getMoodLogByDate = async (date: string) => {
  const { data } = await backendApi.get(`/moodlogs/date/${date}`);
  return data.data;
};

export const getMoodLogByDateRange = async (
  startDate: string,
  endDate: string,
) => {
  const { data } = await backendApi.get(`/moodlogs/range/`, {
    params: {
      startDate,
      endDate,
    },
  });
  console.log("getMoodLogByDateRange data:", data.data);
  return data.data;
};

export const deleteMoodLog = async (moodlog_id: number) => {
  const { data } = await backendApi.delete(`/moodlogs/${moodlog_id}/`);
  return data;
};

export const setMoodLog = async (date: string, mood: number) => {
  const { data } = await backendApi.post("/moodlogs/", {
    date,
    mood,
  });
  return data;
};
