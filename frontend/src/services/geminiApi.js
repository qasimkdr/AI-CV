import api from "../lib/axios";

export const enhanceResume = async (resumeData, { signal } = {}) => {
  const response = await api.post("/ai/enhance-resume", resumeData, { signal, timeout: 120000 });
  return response.data;
};
export const suggestBullets = async (payload) => {
  const response = await api.post("/ai/suggest-bullets", payload);
  return response.data;
};
