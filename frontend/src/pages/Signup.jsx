import AuthLayout from "../components/auth/AuthLayout";
import SignupForm from "../components/auth/SignupForm";

export default function Signup() {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Start building professional resumes"
    >
      <SignupForm />
    </AuthLayout>
  );
}