import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, XCircle } from "lucide-react";

import { TOAST_EVENT } from "../lib/toast";

const ICONS = {
  success: <CheckCircle2 className="text-emerald-500" size={20} />,
  error: <XCircle className="text-rose-500" size={20} />,
  info: <Info className="text-violet" size={20} />,
};

export function Toaster() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const onToast = (e) => {
      const item = e.detail;
      setItems((cur) => [...cur, item]);
      setTimeout(
        () => setItems((cur) => cur.filter((t) => t.id !== item.id)),
        4200
      );
    };
    window.addEventListener(TOAST_EVENT, onToast);
    return () => window.removeEventListener(TOAST_EVENT, onToast);
  }, []);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4"
    >
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            className="glass-strong pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-ink"
          >
            {ICONS[t.type]}
            <span className="line-clamp-3">{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
