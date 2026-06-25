import {
  Bell,
  Menu,
  Search,
  Sparkles,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

export default function DashboardHeader() {
  const { user } = useAuth();

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "CV";

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 md:px-6 lg:px-8">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border border-white/70 bg-white/75 px-4 shadow-xl shadow-slate-200/70 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <button className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-900/20 md:hidden">
                <Menu size={21} />
              </button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-[310px] border-white/60 bg-white/80 p-3 backdrop-blur-xl"
            >
              <Sidebar mobile />
            </SheetContent>
          </Sheet>

          <div className="hidden h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-emerald-400 text-white shadow-lg shadow-sky-500/25 md:grid">
            <Sparkles size={21} />
          </div>

          <div>
            <h1 className="text-base font-black text-slate-950 md:text-lg">
              Dashboard
            </h1>
            <p className="hidden text-xs text-slate-500 sm:block">
              Design, enhance, and export your next CV.
            </p>
          </div>
        </div>

        <div className="hidden min-w-[280px] items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-slate-400 lg:flex">
          <Search size={17} />
          <span className="text-sm">
            Search resumes, templates...
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white/80 text-slate-500 shadow-sm transition hover:text-slate-950 sm:grid">
            <Bell size={18} />
          </button>

          <div className="text-right max-sm:hidden">
            <p className="text-sm font-bold text-slate-950">
              {user?.name || "Guest"}
            </p>
            <p className="text-xs text-slate-500">
              {user?.email || "Welcome"}
            </p>
          </div>

          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-emerald-400 text-sm font-black text-white shadow-lg shadow-sky-500/25">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
