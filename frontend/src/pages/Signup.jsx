import AuthLayout from "../components/auth/AuthLayout";
import SignupForm from "../components/auth/SignupForm";

export default function Signup() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="It's free. Your first AI-polished resume is minutes away."
      side={{ title: <>Start strong. <span className="text-gradient">Stand out.</span></> }}
    >
      <SignupForm />
    </AuthLayout>
  );
}
