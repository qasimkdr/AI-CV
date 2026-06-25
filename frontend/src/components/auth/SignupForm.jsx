import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Eye,
  EyeOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signupUser } from "../../services/authApi";
import { useAuth } from "../../context/AuthContext";
import { setAuthToken } from "../../lib/authStorage";

export default function SignupForm() {
  const navigate = useNavigate();

  const { setUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const data = await signupUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      setAuthToken(data.token);
      setUser(data.user);

      navigate("/dashboard");
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <Label className="mb-2 text-slate-700">
          Full Name
        </Label>

        <Input
          placeholder="Muhammad Qasim"
          value={form.name}
          className="h-11 border-slate-200 bg-white"
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />
      </div>

      <div>
        <Label className="mb-2 text-slate-700">
          Email
        </Label>

        <Input
          type="email"
          placeholder="john@example.com"
          value={form.email}
          className="h-11 border-slate-200 bg-white"
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />
      </div>

      <div>
        <Label className="mb-2 text-slate-700">
          Password
        </Label>

        <div className="relative">
          <Input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Password"
            value={form.password}
            className="h-11 border-slate-200 bg-white pr-11"
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (current) => !current
              )
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </div>

      <div>
        <Label className="mb-2 text-slate-700">
          Confirm Password
        </Label>

        <div className="relative">
          <Input
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            placeholder="Confirm password"
            value={form.confirmPassword}
            className="h-11 border-slate-200 bg-white pr-11"
            onChange={(e) =>
              setForm({
                ...form,
                confirmPassword:
                  e.target.value,
              })
            }
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                (current) => !current
              )
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
            aria-label={
              showConfirmPassword
                ? "Hide confirm password"
                : "Show confirm password"
            }
          >
            {showConfirmPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <Button
        type="submit"
        className="h-11 w-full bg-slate-950 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800"
      >
        Create Account
      </Button>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-sky-600 hover:text-sky-700"
        >
          Login
        </Link>
      </p>
    </form>
  );
}
