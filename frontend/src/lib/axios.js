import axios from "axios";
import {
  clearAuthSession,
  getAuthToken,
  redirectToHome,
} from "./authStorage";

const api =
  axios.create({
    baseURL:
      "https://ai-cv-qf0m.onrender.com",
    headers: {
      "Content-Type":
        "application/json",
    },
  });

api.interceptors.request.use(
  (config) => {
    const token =
      getAuthToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    } else if (
      !config.url?.startsWith(
        "/auth/login"
      ) &&
      !config.url?.startsWith(
        "/auth/signup"
      )
    ) {
      clearAuthSession();
      redirectToHome();
    }

    return config;
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error?.response?.status === 401
    ) {
      clearAuthSession();
      redirectToHome();
    }

    return Promise.reject(error);
  }
);

export default api;
