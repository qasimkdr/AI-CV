import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";

export default function Login() {
  return (
    <AuthLayout title="Welcome back" subtitle="Log in to keep building resumes that get you hired.">
      <LoginForm />
    </AuthLayout>
  );
}
