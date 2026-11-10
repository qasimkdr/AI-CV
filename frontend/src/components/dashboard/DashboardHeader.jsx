import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";

import { LogoMark } from "../brand/Logo";
import { useAuth } from "../../context/AuthContext";
import { initialsOf, logout } from "../../lib/session";

export default function DashboardHeader({ title, subtitle, actions }) {
  const { user } = useAuth();

  return (
    <header className="no-print flex items-center justify-between gap-3 pb-6 pt-4 lg:pt-6">
      <div className="flex min-w-0 items-center gap-3">
        <Link to="/dashboard" className="lg:hidden" aria-label="Dashboard">
          <LogoMark size={40} />
        </Link>
        <div className="min-w-0">
          {title && <h1 className="truncate text-xl font-extrabold text-ink sm:text-3xl">{title}</h1>}
          {subtitle && <p className="mt-0.5 hidden truncate text-sm text-ink-soft sm:block">{subtitle}</p>}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {actions}
        <Link
          to="/profile"
          className="glass flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-4 transition hover:bg-white"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-xs font-bold text-white">
            {initialsOf(user?.name)}
          </span>
          <span className="hidden text-left leading-tight md:block">
            <span className="block text-sm font-semibold text-ink">{user?.name || "Welcome"}</span>
            <span className="block max-w-[160px] truncate text-xs text-ink-soft">{user?.email}</span>
          </span>
        </Link>
        <button type="button" onClick={logout} aria-label="Log out" className="btn btn-glass h-11 w-11 px-0 text-rose-500 lg:hidden">
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}
