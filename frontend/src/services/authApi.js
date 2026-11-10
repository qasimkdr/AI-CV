import api from "../lib/axios";

export const signupUser = async (data) => (await api.post("/auth/signup", data)).data;

export const loginUser = async (data) => (await api.post("/auth/login", data)).data;

export const getCurrentUser = async () => (await api.get("/auth/me")).data;

export const logoutUser = async () => (await api.post("/auth/logout")).data;

export const updateProfile = async (data) => (await api.put("/auth/profile", data)).data;
