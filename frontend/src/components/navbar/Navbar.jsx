import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, LayoutDashboard, Menu, X } from "lucide-react";

import Logo from "../brand/Logo";
import { getAuthToken } from "../../lib/authStorage";

const links = [
  { label: "Features", to: "/#features" },
  { label: "Templates", to: "/templates" },
  { label: "How it works", to: "/#how-it-works" },
  { label: "FAQ", to: "/#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const loggedIn = Boolean(getAuthToken());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile menu whenever the route changes
  const [routeKey, setRouteKey] = useState(location.key);
  if (routeKey !== location.key) {
    setRouteKey(location.key);
    setOpen(false);
  }

  return (
    <header className="no-print fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <motion.nav
        aria-label="Main"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-3 transition-all duration-500 sm:px-4 ${
          scrolled ? "glass-strong h-14 [background:rgb(255_255_255/0.88)]" : "glass h-16"
        }`}
      >
        <Logo size={scrolled ? 34 : 38} className="pl-1" />

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive && !l.to.includes("#")
                      ? "bg-white text-ink shadow-sm"
                      : "text-ink-soft hover:bg-white/70 hover:text-ink"
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          {loggedIn ? (
            <Link to="/dashboard" className="btn btn-primary btn-sm">
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Log in
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Build my CV
                <ArrowRight size={16} />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/80 text-ink shadow-sm md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="glass-strong mx-auto mt-2 max-w-6xl rounded-3xl p-3 md:hidden"
          >
            <ul className="grid gap-1">
              {links.map((l, i) => (
                <motion.li
                  key={l.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <Link
                    to={l.to}
                    className="block rounded-2xl px-4 py-3 text-base font-medium text-ink hover:bg-white"
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {loggedIn ? (
                <Link to="/dashboard" className="btn btn-primary col-span-2">
                  Go to dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn btn-glass">
                    Log in
                  </Link>
                  <Link to="/signup" className="btn btn-primary">
                    Sign up free
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
