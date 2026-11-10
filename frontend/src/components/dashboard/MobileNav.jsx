import { NavLink, Link } from "react-router-dom";
import { FileText, LayoutDashboard, LayoutTemplate, Plus, User } from "lucide-react";

const items = [
  { label: "Home", to: "/dashboard", icon: LayoutDashboard, end: true },
  { label: "Resumes", to: "/dashboard#resumes", icon: FileText },
  null,
  { label: "Templates", to: "/templates", icon: LayoutTemplate },
  { label: "Profile", to: "/profile", icon: User },
];

export default function MobileNav() {
  return (
    <nav aria-label="Mobile" className="no-print fixed inset-x-3 bottom-3 z-40 lg:hidden">
      <ul className="glass-strong flex items-center justify-around rounded-[1.6rem] px-2 py-2">
        {items.map((item) =>
          item ? (
            <li key={item.label}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex w-16 flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[11px] font-medium transition ${
                    isActive && !item.to.includes("#") ? "text-violet" : "text-ink-soft"
                  }`
                }
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            </li>
          ) : (
            <li key="fab">
              <Link
                to="/create-resume"
                aria-label="Create resume"
                className="btn btn-primary -mt-8 h-14 w-14 rounded-2xl px-0 shadow-[0_14px_30px_-10px_rgb(124_92_255/0.9)]"
              >
                <Plus size={24} />
              </Link>
            </li>
          )
        )}
      </ul>
    </nav>
  );
}
