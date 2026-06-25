import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">

        {/* Logo */}

        <Link
          to="/"
          className="group flex items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-500 to-indigo-600 shadow-lg shadow-cyan-500/30 transition duration-300 group-hover:rotate-6 group-hover:scale-105">

            <Sparkles
              className="text-white"
              size={22}
            />

          </div>

          <div>

            <h1 className="bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 bg-clip-text text-2xl font-black text-transparent">
              CVCraft
            </h1>

            <p className="-mt-1 text-xs text-slate-500">
              AI Resume Studio
            </p>

          </div>
        </Link>

        {/* Navigation */}

        <nav className="hidden items-center gap-10 md:flex">

          <a
            href="#features"
            className="font-medium text-slate-600 transition hover:text-cyan-600"
          >
            Features
          </a>

          <a
            href="#templates"
            className="font-medium text-slate-600 transition hover:text-cyan-600"
          >
            Templates
          </a>

          <a
            href="#how-it-works"
            className="font-medium text-slate-600 transition hover:text-cyan-600"
          >
            How It Works
          </a>

        </nav>

        {/* Buttons */}

        <div className="flex items-center gap-3">

          <Link to="/login">

            <Button
              variant="outline"
              className="rounded-xl border-slate-200 bg-white/70 px-6 transition hover:border-cyan-300 hover:bg-cyan-50"
            >
              Login
            </Button>

          </Link>

          <Link to="/signup">

            <Button className="rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 px-7 shadow-xl shadow-cyan-500/30 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(34,211,238,.45)]">

              Get Started

            </Button>

          </Link>

        </div>

      </div>
    </header>
  );
}