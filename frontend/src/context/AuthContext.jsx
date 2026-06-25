import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
} from "../services/authApi";
import {
  clearAuthToken,
  getAuthToken,
} from "../lib/authStorage";

const AuthContext =
  createContext();

export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchUser =
      async () => {
        if (!getAuthToken()) {
          setUser(null);
          setLoading(false);
          return;
        }

        try {
          const data =
            await getCurrentUser();

          setUser(data);
        } catch (error) {
          console.log(
            "Auth Error:",
            error
          );

          setUser(null);
          clearAuthToken();
        } finally {
          setLoading(false);
        }
      };

    fetchUser();
  }, []);

  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
    };

    window.addEventListener(
      "auth:logout",
      handleLogout
    );

    return () => {
      window.removeEventListener(
        "auth:logout",
        handleLogout
      );
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(
    AuthContext
  );
};
