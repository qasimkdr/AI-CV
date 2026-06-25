import api from "../lib/axios";

export const enhanceResume =
  async (resumeData) => {
    const response =
      await api.post(
        "/ai/enhance-resume",
        resumeData
      );

    return response.data;
  };