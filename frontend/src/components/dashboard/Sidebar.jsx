import {
  Link,
  NavLink,
  useLocation,
} from "react-router-dom";

import {
  FileText,
  LayoutDashboard,
  LogOut,
  Plus,
  Sparkles,
  User,
} from "lucide-react";

import {
  clearAuthSession,
  redirectToHome,
} from "../../lib/authStorage";

const navItems = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Create Resume",
    to: "/create-resume",
    icon: Plus,
  },
  {
    label: "My Resumes",
    to: "/dashboard#recent-resumes",
    icon: FileText,
  },
  {
    label: "Profile",
    to: "/profile",
    icon: User,
  },
];

export default function Sidebar({
  mobile = false,
}) {
  const location = useLocation();

  const handleLogout = () => {
    clearAuthSession();
    redirectToHome();
  };

  return (
    <aside
      className={`${
        mobile
          ? "w-full"
          : "sticky top-20 hidden h-[calc(100vh-6rem)] min-h-[640px] w-72 shrink-0 px-4 pb-6 md:block"
      }`}
    >
      <div className="flex h-full min-h-0 flex-col rounded-2xl border border-white/70 bg-white/70 p-4 shadow-2xl shadow-slate-200/70 backdrop-blur-xl">
        <Link
          to="/dashboard"
          className="mb-5 flex items-center gap-3 rounded-2xl bg-slate-950 p-4 text-white shadow-xl shadow-slate-900/20"
        >
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-sky-400 to-emerald-300 text-slate-950">
            <Sparkles size={22} />
          </div>

          <div>
            <h2 className="text-xl font-black leading-none">
              CVCraft
            </h2>
            <p className="mt-1 text-xs text-slate-300">
              AI resume studio
            </p>
          </div>
        </Link>

        <nav className="min-h-0 flex-1 overflow-y-auto pr-1">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isHashItem =
                item.to.includes("#");
              const isCurrentHash =
                location.pathname +
                  location.hash ===
                item.to;
              const isDashboardRoot =
                item.to === "/dashboard" &&
                location.pathname ===
                  "/dashboard" &&
                !location.hash;

              return (
                <li key={item.label}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      {
                        const active =
                          isHashItem
                            ? isCurrentHash
                            : isDashboardRoot ||
                              (isActive &&
                                item.to !==
                                  "/dashboard");

                        return (
                      `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                        active
                          ? "bg-slate-950 text-white shadow-lg shadow-slate-900/15"
                          : "text-slate-600 hover:bg-white/80 hover:text-slate-950 hover:shadow-md hover:shadow-slate-200/60"
                      }`
                        );
                      }
                    }
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/12 ring-1 ring-slate-200/70 transition group-hover:scale-105">
                      <Icon size={18} />
                    </span>
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
          <p className="text-sm font-bold text-slate-950">
            3D workspace
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Build, enhance, preview, and export resumes from one motion-ready dashboard.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50 hover:shadow-md hover:shadow-red-100"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-red-50">
            <LogOut size={18} />
          </span>
          Logout
        </button>
      </div>
    </aside>
  );
}
