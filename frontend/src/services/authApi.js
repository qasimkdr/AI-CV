import api from "../lib/axios";

export const signupUser = async (data) => {
  try {
    const response = await api.post(
      "/auth/signup",
      data
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (data) => {
  try {
    const response = await api.post(
      "/auth/login",
      data
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get(
      "/auth/me"
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post(
      "/auth/logout"
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (data) => {
  try {
    const response = await api.put(
      "/auth/profile",
      data
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
