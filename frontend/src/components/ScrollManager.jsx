import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scrolls to #hash targets (after lazy content mounts) or to top on navigation. */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    let tries = 0;
    const tick = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (tries++ < 20) {
        setTimeout(tick, 60);
      }
    };
    tick();
  }, [pathname, hash]);

  return null;
}
