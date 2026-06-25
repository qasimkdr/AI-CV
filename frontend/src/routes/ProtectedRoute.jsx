import { Navigate } from "react-router-dom";

import { getAuthToken } from "../lib/authStorage";

export default function ProtectedRoute({
  children,
}) {
  if (!getAuthToken()) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}
