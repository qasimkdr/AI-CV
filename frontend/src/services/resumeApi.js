import api from "../lib/axios";

export const createResume = async (
  data
) => {
  const response = await api.post(
    "/resumes",
    data
  );

  return response.data;
};

export const getResumes =
  async () => {
    const response =
      await api.get("/resumes");

    return response.data;
  };

export const getResume =
  async (id) => {
    const response =
      await api.get(
        `/resumes/${id}`
      );

    return response.data;
  };

export const updateResume =
  async (id, data) => {
    const response =
      await api.put(
        `/resumes/${id}`,
        data
      );

    return response.data;
  };

export const deleteResume =
  async (id) => {
    const response =
      await api.delete(
        `/resumes/${id}`
      );

    return response.data;
  };