import { clearAuthSession, redirectToHome } from "./authStorage";

export const logout = () => {
  clearAuthSession();
  redirectToHome();
};

export const initialsOf = (name) =>
  name
    ?.split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "CV";
