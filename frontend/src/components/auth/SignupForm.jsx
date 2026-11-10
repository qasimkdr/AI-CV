import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Lock, Mail, User } from "lucide-react";

import { Field, FormError, PasswordField, Spinner, StrengthMeter } from "./fields";
import { signupUser } from "../../services/authApi";
import { useAuth } from "../../context/AuthContext";
import { setAuthToken } from "../../lib/authStorage";

export default function SignupForm() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { setUser } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const data = await signupUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setAuthToken(data.token);
      setUser(data.user);

      const template = params.get("template");
      navigate(template ? `/create-resume?template=${template}` : "/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const mismatch = form.confirmPassword && form.confirmPassword !== form.password;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field id="name" label="Full name" icon={User} autoComplete="name" placeholder="Jane Doe" required value={form.name} onChange={set("name")} />

      <Field id="email" label="Email" icon={Mail} type="email" autoComplete="email" placeholder="you@example.com" required value={form.email} onChange={set("email")} />

      <PasswordField
        id="password"
        label="Password"
        icon={Lock}
        autoComplete="new-password"
        placeholder="Create a password"
        required
        value={form.password}
        onChange={set("password")}
        hint={<StrengthMeter value={form.password} />}
      />

      <PasswordField
        id="confirmPassword"
        label="Confirm password"
        icon={Lock}
        autoComplete="new-password"
        placeholder="Repeat your password"
        required
        value={form.confirmPassword}
        onChange={set("confirmPassword")}
        aria-invalid={Boolean(mismatch)}
        hint={mismatch ? <p className="mt-1 text-xs text-rose-500">Passwords don't match yet</p> : null}
      />

      <FormError>{error}</FormError>

      <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
        {loading ? <Spinner /> : null}
        {loading ? "Creating account…" : "Create free account"}
        {!loading && <ArrowRight size={18} />}
      </button>

      <p className="text-center text-sm text-ink-soft">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-violet hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
