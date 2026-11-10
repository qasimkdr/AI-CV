import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import { LogoMark } from "../components/brand/Logo";

// Home is eager (it's the landing/LCP page); everything else is code-split.
const Templates = lazy(() => import("../pages/Templates"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const CreateResume = lazy(() => import("../pages/CreateResume"));
const EditResume = lazy(() => import("../pages/EditResume"));
const ResumePreview = lazy(() => import("../pages/ResumePreview"));
const Profile = lazy(() => import("../pages/Profile"));
const NotFound = lazy(() => import("../pages/NotFound"));

function PageLoader() {
  return (
    <div className="grid min-h-[100dvh] place-items-center">
      <div className="aurora" aria-hidden="true" />
      <div className="flex flex-col items-center gap-4">
        <div className="animate-float">
          <LogoMark size={56} />
        </div>
        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-violet/10">
          <div className="h-full w-1/2 animate-[marquee_1s_linear_infinite] rounded-full bg-brand" />
        </div>
      </div>
    </div>
  );
}

const guard = (el) => <ProtectedRoute>{el}</ProtectedRoute>;

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={guard(<Dashboard />)} />
        <Route path="/create-resume" element={guard(<CreateResume />)} />
        <Route path="/profile" element={guard(<Profile />)} />
        <Route path="/edit-resume/:id" element={guard(<EditResume />)} />
        <Route path="/resume-preview/:id" element={guard(<ResumePreview />)} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
