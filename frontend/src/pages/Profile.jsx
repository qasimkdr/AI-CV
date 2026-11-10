import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, Mail, ShieldCheck, User, UserCog } from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import TiltCard from "../components/motion/TiltCard";
import { Field, FormError, PasswordField, Spinner, StrengthMeter } from "../components/auth/fields";
import { initialsOf } from "../lib/session";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../services/authApi";
import { toast } from "../lib/toast";

const TABS = [
  { id: "account", label: "Account", icon: UserCog },
  { id: "security", label: "Security", icon: ShieldCheck },
];

export default function Profile() {
  const { user, setUser } = useAuth();
  const [tab, setTab] = useState("account");
  const [form, setForm] = useState({ name: "", email: "", currentPassword: "", newPassword: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // seed the form whenever the signed-in user object changes
  const [syncedUser, setSyncedUser] = useState(null);
  if (user && user !== syncedUser) {
    setSyncedUser(user);
    setForm((c) => ({ ...c, name: user.name || "", email: user.email || "" }));
  }

  const handleChange = (e) => setForm((c) => ({ ...c, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = { name: form.name.trim(), email: form.email.trim() };
      if (form.newPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
      }
      const data = await updateProfile(payload);
      setUser(data.user);
      setForm((c) => ({ ...c, currentPassword: "", newPassword: "" }));
      toast.success(data.message || "Profile updated");
    } catch (err) {
      setError(err?.response?.data?.message || "Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Profile" subtitle="Manage your account and security." seoTitle="Profile — AI CV">
      <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        {/* Identity card */}
        <TiltCard max={8} className="glass-strong relative overflow-hidden rounded-[2rem] p-8 text-center lg:self-start">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-violet/30 via-sky/25 to-blush/25" />
          <div className="relative">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto mt-6 grid h-24 w-24 place-items-center rounded-[1.75rem] bg-brand font-display text-3xl font-extrabold text-white shadow-[0_20px_40px_-14px_rgb(124_92_255/0.8)] ring-4 ring-white"
            >
              {initialsOf(form.name)}
            </motion.div>
            <h2 className="mt-5 text-2xl font-extrabold text-ink">{form.name || "Your name"}</h2>
            <p className="mt-1 text-sm text-ink-soft">{form.email || "you@example.com"}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
              <ShieldCheck size={13} /> Account active
            </span>
          </div>
        </TiltCard>

        {/* Settings */}
        <form onSubmit={handleSubmit} className="glass-strong rounded-[2rem] p-6 sm:p-8">
          <div role="tablist" aria-label="Profile settings" className="glass inline-flex rounded-full p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`relative flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition ${tab === t.id ? "text-white" : "text-ink-soft hover:text-ink"}`}
              >
                {tab === t.id && <motion.span layoutId="profile-tab" className="bg-brand absolute inset-0 rounded-full" />}
                <span className="relative flex items-center gap-2">
                  <t.icon size={16} /> {t.label}
                </span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="mt-8 grid gap-5"
            >
              {tab === "account" ? (
                <>
                  <div>
                    <h3 className="text-xl font-bold text-ink">Account details</h3>
                    <p className="mt-1 text-sm text-ink-soft">This is how you appear across AI CV.</p>
                  </div>
                  <Field id="name" name="name" label="Full name" icon={User} autoComplete="name" value={form.name} onChange={handleChange} required />
                  <Field id="email" name="email" type="email" label="Email" icon={Mail} autoComplete="email" value={form.email} onChange={handleChange} required />
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-xl font-bold text-ink">Change password</h3>
                    <p className="mt-1 text-sm text-ink-soft">Leave empty to keep your current password.</p>
                  </div>
                  <PasswordField id="currentPassword" name="currentPassword" label="Current password" icon={Lock} autoComplete="current-password" value={form.currentPassword} onChange={handleChange} placeholder="Required to set a new one" />
                  <PasswordField
                    id="newPassword"
                    name="newPassword"
                    label="New password"
                    icon={Lock}
                    autoComplete="new-password"
                    value={form.newPassword}
                    onChange={handleChange}
                    placeholder="At least 8 characters"
                    hint={<StrengthMeter value={form.newPassword} />}
                  />
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6">
            <FormError>{error}</FormError>
          </div>

          <div className="mt-6 flex justify-end">
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving && <Spinner />}
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
