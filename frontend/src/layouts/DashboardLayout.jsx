import { useState } from "react";
import { motion } from "framer-motion";

import Sidebar from "../components/dashboard/Sidebar";
import MobileNav from "../components/dashboard/MobileNav";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import Seo from "../components/seo/Seo";

const KEY = "aicv:sidebar-collapsed";

export default function DashboardLayout({ children, title, subtitle, actions, seoTitle, wide = false, focus = false }) {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(KEY) === "1";
    } catch {
      return false;
    }
  });

  const toggle = () =>
    setCollapsed((v) => {
      try {
        localStorage.setItem(KEY, v ? "0" : "1");
      } catch {
        /* ignore */
      }
      return !v;
    });

  return (
    <>
      <Seo title={seoTitle || `${title || "Dashboard"} — AI CV`} noindex />
      <div className="aurora" aria-hidden="true" />
      <div className="flex min-h-[100dvh]">
        <Sidebar collapsed={collapsed} onToggle={toggle} />

        <div className={`min-w-0 flex-1 px-4 sm:px-6 lg:pb-10 lg:pl-2 lg:pr-8 ${focus ? "pb-8" : "pb-28"}`}>
          <div className={`mx-auto ${wide ? "max-w-[1400px]" : "max-w-6xl"}`}>
            <DashboardHeader title={title} subtitle={subtitle} actions={actions} />
            <motion.main
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.main>
          </div>
        </div>
      </div>
      {!focus && <MobileNav />}
    </>
  );
}
