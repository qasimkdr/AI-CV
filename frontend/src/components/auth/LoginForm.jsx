import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail } from "lucide-react";

import { Field, FormError, PasswordField, Spinner } from "./fields";
import { loginUser } from "../../services/authApi";
import { useAuth } from "../../context/AuthContext";
import { setAuthToken } from "../../lib/authStorage";

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(form);
      setAuthToken(data.token);
      setUser(data.user);
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field
        id="email"
        label="Email"
        icon={Mail}
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        required
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <PasswordField
        id="password"
        label="Password"
        icon={Lock}
        autoComplete="current-password"
        placeholder="Your password"
        required
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <FormError>{error}</FormError>

      <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
        {loading ? <Spinner /> : null}
        {loading ? "Logging in…" : "Log in"}
        {!loading && <ArrowRight size={18} />}
      </button>

      <p className="text-center text-sm text-ink-soft">
        New to AI CV?{" "}
        <Link to="/signup" className="font-semibold text-violet hover:underline">
          Create a free account
        </Link>
      </p>
    </form>
  );
}
