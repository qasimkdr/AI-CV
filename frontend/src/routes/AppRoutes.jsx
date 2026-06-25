import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import CreateResume from "../pages/CreateResume";
import EditResume from "../pages/EditResume";
import ResumePreview from "../pages/ResumePreview";
import Profile from "../pages/Profile";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/create-resume"
        element={
          <ProtectedRoute>
            <CreateResume />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-resume/:id"
        element={
          <ProtectedRoute>
            <EditResume />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resume-preview/:id"
        element={
          <ProtectedRoute>
            <ResumePreview />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Home />} />
    </Routes>
  );
}
