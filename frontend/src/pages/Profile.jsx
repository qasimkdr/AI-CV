import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Mail,
  Sparkles,
  User,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../services/authApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Profile() {
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });

  const [message, setMessage] =
    useState("");
  const [error, setError] =
    useState("");
  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    if (user) {
      setForm((current) => ({
        ...current,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
      };

      if (form.newPassword) {
        payload.currentPassword =
          form.currentPassword;
        payload.newPassword =
          form.newPassword;
      }

      const data =
        await updateProfile(payload);

      setUser(data.user);
      setForm((current) => ({
        ...current,
        currentPassword: "",
        newPassword: "",
      }));
      setMessage(data.message);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Profile update failed"
      );
    } finally {
      setSaving(false);
    }
  };

  const initials =
    form.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "CV";

  return (
    <DashboardLayout>
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.25fr]">
        <motion.section
          initial={{
            opacity: 0,
            y: 24,
            rotateX: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
            rotateX: 0,
          }}
          transition={{
            duration: 0.55,
            ease: "easeOut",
          }}
          className="relative min-h-[420px] rounded-2xl border border-white/70 bg-slate-950 p-8 text-white shadow-2xl shadow-sky-900/20"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.35),transparent_32%),radial-gradient(circle_at_80%_70%,rgba(52,211,153,0.28),transparent_34%)]" />
          <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(120deg,rgba(255,255,255,0.14),transparent_36%,rgba(255,255,255,0.08))]" />

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-sky-100 backdrop-blur">
                <Sparkles size={16} />
                Motion profile layer
              </div>

              <h1 className="text-4xl font-bold tracking-tight">
                Profile Settings
              </h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
                Update your account details here. This is the first dashboard piece shaped for the new 3D motion direction.
              </p>
            </div>

            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative mt-10 rounded-2xl border border-white/15 bg-white/10 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl"
              style={{
                transform:
                  "translateZ(36px) rotateX(4deg)",
              }}
            >
              <div className="flex items-center gap-4">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 to-emerald-300 text-xl font-black text-slate-950 shadow-lg shadow-sky-500/30">
                  {initials}
                </div>

                <div>
                  <p className="font-semibold">
                    {form.name || "Your name"}
                  </p>
                  <p className="text-sm text-slate-300">
                    {form.email ||
                      "your@email.com"}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        <motion.form
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.08,
            duration: 0.45,
          }}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/70 bg-white/85 p-6 shadow-xl shadow-slate-200/70 backdrop-blur-xl md:p-8"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-950">
              Account Details
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Leave password fields empty if you only want to update name or email.
            </p>
          </div>

          <div className="grid gap-5">
            <div>
              <Label className="mb-2 text-slate-700">
                <User size={16} />
                Full Name
              </Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="h-11 border-slate-200 bg-white"
                required
              />
            </div>

            <div>
              <Label className="mb-2 text-slate-700">
                <Mail size={16} />
                Email
              </Label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="h-11 border-slate-200 bg-white"
                required
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Label className="mb-2 text-slate-700">
                  <Lock size={16} />
                  Current Password
                </Label>
                <Input
                  name="currentPassword"
                  type="password"
                  value={form.currentPassword}
                  onChange={handleChange}
                  className="h-11 border-slate-200 bg-white"
                  placeholder="Required for password change"
                />
              </div>

              <div>
                <Label className="mb-2 text-slate-700">
                  <Lock size={16} />
                  New Password
                </Label>
                <Input
                  name="newPassword"
                  type="password"
                  value={form.newPassword}
                  onChange={handleChange}
                  className="h-11 border-slate-200 bg-white"
                  placeholder="Leave empty to keep current"
                />
              </div>
            </div>
          </div>

          {message && (
            <p className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </p>
          )}

          {error && (
            <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="mt-8 flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="h-11 bg-slate-950 px-6 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </div>
        </motion.form>
      </div>
    </DashboardLayout>
  );
}
