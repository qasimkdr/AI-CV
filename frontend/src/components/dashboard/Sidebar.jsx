import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronsLeft, FileText, LayoutDashboard, LayoutTemplate, LogOut, Plus, User } from "lucide-react";

import Logo, { LogoMark } from "../brand/Logo";
import { logout } from "../../lib/session";

const NAV = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, end: true },
  { label: "My resumes", to: "/dashboard#resumes", icon: FileText },
  { label: "Create resume", to: "/create-resume", icon: Plus },
  { label: "Templates", to: "/templates", icon: LayoutTemplate },
  { label: "Profile", to: "/profile", icon: User },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 88 : 264 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="no-print sticky top-0 hidden h-[100dvh] shrink-0 p-4 lg:block"
    >
      <div className="glass flex h-full flex-col rounded-[1.75rem] p-3">
        <div className={`flex h-14 items-center ${collapsed ? "justify-center" : "justify-between px-2"}`}>
          {collapsed ? (
            <Link to="/dashboard" aria-label="Dashboard">
              <LogoMark size={38} />
            </Link>
          ) : (
            <Logo to="/dashboard" size={36} />
          )}
        </div>

        <Link
          to="/create-resume"
          className={`btn btn-primary mt-4 ${collapsed ? "h-12 w-12 self-center px-0" : "w-full"}`}
          aria-label="Create resume"
        >
          <Plus size={18} />
          {!collapsed && "New resume"}
        </Link>

        <nav aria-label="Dashboard" className="mt-6 flex-1">
          <ul className="space-y-1">
            {NAV.filter((n) => n.to !== "/create-resume").map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `group relative flex h-12 items-center gap-3 rounded-2xl text-sm font-medium transition ${
                        collapsed ? "justify-center" : "px-3"
                      } ${
                        isActive && !item.to.includes("#")
                          ? "bg-white text-ink shadow-[0_8px_20px_-12px_rgb(76_60_180/0.45)]"
                          : "text-ink-soft hover:bg-white/60 hover:text-ink"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && !item.to.includes("#") && (
                          <motion.span layoutId="nav-dot" className="absolute left-0 h-6 w-1 rounded-full bg-brand" />
                        )}
                        <Icon size={19} className="shrink-0" />
                        {!collapsed && item.label}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {!collapsed && (
          <div className="bg-brand-soft mb-3 rounded-2xl border border-white p-4">
            <p className="text-sm font-semibold text-ink">Pro tip ✨</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">
              Tailor one resume per job. Duplicate wording from the job post into your skills.
            </p>
          </div>
        )}

        <div className={`flex gap-2 ${collapsed ? "flex-col items-center" : ""}`}>
          <button
            type="button"
            onClick={logout}
            className={`btn btn-ghost h-11 text-rose-500 hover:bg-rose-50 hover:text-rose-600 ${collapsed ? "w-11 px-0" : "flex-1 justify-start px-3"}`}
            aria-label="Log out"
          >
            <LogOut size={18} />
            {!collapsed && "Log out"}
          </button>
          <button
            type="button"
            onClick={onToggle}
            className="btn btn-ghost h-11 w-11 px-0"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronsLeft size={18} className={`transition ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
