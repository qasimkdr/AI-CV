import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function Field({ id, label, icon: Icon, hint, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft/70" />
        )}
        <input id={id} className={`field ${Icon ? "pl-11" : ""}`} {...props} />
      </div>
      {hint}
    </div>
  );
}

export function PasswordField({ id, label, icon: Icon, hint, ...props }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft/70" />
        )}
        <input
          id={id}
          type={show ? "text" : "password"}
          className={`field pr-12 ${Icon ? "pl-11" : ""}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-ink-soft transition hover:bg-violet/10 hover:text-ink"
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
      {hint}
    </div>
  );
}

function strength(pw = "") {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export function StrengthMeter({ value }) {
  const s = strength(value);
  const labels = ["Too short", "Weak", "Okay", "Strong", "Excellent"];
  const colors = ["bg-rose-400", "bg-rose-400", "bg-amber-400", "bg-sky", "bg-emerald-500"];
  if (!value) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-full transition ${i < s ? colors[s] : "bg-violet/10"}`} />
        ))}
      </div>
      <p className="mt-1 text-xs text-ink-soft">{labels[s]}</p>
    </div>
  );
}

export function FormError({ children }) {
  if (!children) return null;
  return (
    <p role="alert" className="rounded-2xl border border-rose-100 bg-rose-50/80 px-4 py-3 text-sm text-rose-600">
      {children}
    </p>
  );
}

export function Spinner() {
  return <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />;
}
