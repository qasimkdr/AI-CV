import { Navigate, useLocation } from "react-router-dom";

import { getAuthToken } from "../lib/authStorage";

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!getAuthToken()) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  return children;
}
