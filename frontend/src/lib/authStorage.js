const TOKEN_KEY = "token";

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const clearAuthSession = () => {
  clearAuthToken();
  window.dispatchEvent(new Event("auth:logout"));
};

export const redirectToHome = () => {
  if (window.location.pathname !== "/") {
    window.location.assign("/");
  }
};
