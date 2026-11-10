import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const scenes = {
  hero: lazy(() => import("./HeroScene")),
  shapes: lazy(() => import("./ShapesScene")),
};

const hasWebGL = () => {
  try {
    const c = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (c.getContext("webgl2") || c.getContext("webgl"))
    );
  } catch {
    return false;
  }
};

/**
 * Loads a WebGL scene only after the page is idle, pauses it when it
 * scrolls out of view, renders a still frame for reduced-motion users and
 * falls back to a CSS illustration when WebGL is unavailable.
 */
export default function Scene3D({ scene = "hero", fallback = null, className = "", ...props }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [supported] = useState(() => typeof window !== "undefined" && hasWebGL());
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!supported) return;
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 250));
    const cancel = window.cancelIdleCallback || clearTimeout;
    const id = idle(() => setReady(true), { timeout: 1500 });
    return () => cancel(id);
  }, [supported]);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      rootMargin: "120px",
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const Scene = scenes[scene];

  return (
    <div ref={ref} className={className || "relative"}>
      {supported && ready ? (
        <Suspense fallback={fallback}>
          <Scene active={visible && !reduce} {...props} />
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}
