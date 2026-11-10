import { useEffect, useRef, useState } from "react";

import sampleResume from "../data/sampleResume";

// Natural width the templates are designed at.
const BASE_WIDTH = 820;

/**
 * Renders a real resume template scaled to fit its container width.
 * `aspect` = height / width of the visible window, or "auto" to show the
 * whole document at its natural height.
 */
export default function TemplateThumb({
  template: Template,
  data = sampleResume,
  aspect = 1.3,
  className = "",
}) {
  const outer = useRef(null);
  const inner = useRef(null);
  const [scale, setScale] = useState(0.3);
  const [innerH, setInnerH] = useState(0);
  const auto = aspect === "auto";

  useEffect(() => {
    if (!outer.current) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / BASE_WIDTH));
    ro.observe(outer.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || !inner.current) return;
    const ro = new ResizeObserver(([entry]) => setInnerH(entry.contentRect.height));
    ro.observe(inner.current);
    return () => ro.disconnect();
  }, [auto]);

  return (
    <div
      ref={outer}
      className={`relative w-full overflow-hidden bg-white ${className}`}
      style={auto ? { height: Math.max(innerH * scale, 200) } : { aspectRatio: `1 / ${aspect}` }}
      aria-hidden="true"
    >
      <div
        ref={inner}
        className="resume-root pointer-events-none absolute left-0 top-0 origin-top-left select-none"
        style={{ width: BASE_WIDTH, transform: `scale(${scale})` }}
        inert
      >
        <Template data={data} />
      </div>
    </div>
  );
}
