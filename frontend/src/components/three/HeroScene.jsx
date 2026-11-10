import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Sparkles } from "@react-three/drei";
import * as THREE from "three";

import { GlassShape, ResumeSheet, SkillChip, StudioLights } from "./parts";
import { usePointerRig } from "./rig";
import { makeResumeTexture } from "./texture";
import { SHEET_VARIANTS } from "./variants";

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function MainSheet({ onVariant }) {
  const sheet = useRef();
  const front = useRef();
  const back = useRef();

  const textures = useMemo(
    () => SHEET_VARIANTS.map((v, i) => makeResumeTexture(v, i)),
    []
  );

  const state = useRef({ index: 0, spinning: false, start: 0, swapped: false, next: 1, last: 0 });

  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);

  useFrame(({ clock }) => {
    const s = state.current;
    const t = clock.elapsedTime;
    if (!sheet.current) return;

    // Gentle scroll-linked lean.
    const scroll = typeof window !== "undefined" ? window.scrollY : 0;
    sheet.current.rotation.x = THREE.MathUtils.lerp(
      sheet.current.rotation.x,
      Math.min(scroll * 0.0012, 0.5),
      0.08
    );

    if (!s.spinning && t - s.last > 4.6) {
      s.spinning = true;
      s.start = t;
      s.swapped = false;
      s.next = (s.index + 1) % textures.length;
      back.current.material.map = textures[s.next];
      back.current.material.needsUpdate = true;
    }

    if (s.spinning) {
      const p = Math.min((t - s.start) / 1.4, 1);
      sheet.current.rotation.y = ease(p) * Math.PI * 2;
      if (!s.swapped && p >= 0.5) {
        front.current.material.map = textures[s.next];
        front.current.material.needsUpdate = true;
        s.swapped = true;
        s.index = s.next;
        onVariant?.(s.index);
      }
      if (p >= 1) {
        s.spinning = false;
        s.last = t;
        sheet.current.rotation.y = 0;
      }
    } else {
      sheet.current.rotation.y = Math.sin(t * 0.6) * 0.06;
      sheet.current.position.y = Math.sin(t * 0.9) * 0.06;
    }
  });

  return <ResumeSheet sheetRef={sheet} frontRef={front} backRef={back} variant={0} layout={0} />;
}

function Rig({ pointer, onVariant, compact }) {
  const rig = usePointerRig(pointer);

  return (
    <group ref={rig} scale={compact ? 0.82 : 1}>
      {/* stacked sheets behind */}
      <ResumeSheet
        variant={2}
        layout={1}
        position={[-0.9, 0.25, -0.9]}
        rotation={[0, 0.35, -0.12]}
        scale={0.86}
      />
      <ResumeSheet
        variant={1}
        layout={1}
        position={[0.95, -0.15, -1.2]}
        rotation={[0, -0.4, 0.1]}
        scale={0.82}
      />

      <MainSheet onVariant={onVariant} />

      <SkillChip position={[-1.55, 0.9, 0.5]} rotation={[0, 0.3, 0.08]} />
      <SkillChip position={[1.5, -0.95, 0.55]} color="#e0f2fe" accent="#0ea5e9" width={1.1} rotation={[0, -0.3, -0.06]} />
      <SkillChip position={[1.35, 1.25, 0.35]} color="#fce7f3" accent="#ec4899" width={0.75} rotation={[0, -0.25, 0.1]} />

      <GlassShape geometry="torus" color="#c4b5fd" position={[-1.9, -1.0, 0.4]} scale={0.9} />
      <GlassShape geometry="sphere" color="#bae6fd" position={[1.95, 0.35, -0.2]} scale={0.75} speed={1.1} />
      <GlassShape geometry="ico" color="#fbcfe8" position={[-1.6, 1.75, -0.6]} scale={0.55} speed={1.8} />
      <GlassShape geometry="knot" color="#99f6e4" position={[0.4, -1.9, 0.2]} scale={0.7} speed={1.2} />
    </group>
  );
}

export default function HeroScene({ active = true, onVariant }) {
  const pointer = useRef({ x: 0, y: 0 });
  const compact = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <Canvas
      dpr={[1, compact ? 1.5 : 1.8]}
      frameloop={active ? "always" : "demand"}
      camera={{ position: [0, 0, 7.6], fov: 36 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <StudioLights />
      <Rig pointer={pointer} onVariant={onVariant} compact={compact} />
      <Sparkles count={compact ? 30 : 60} scale={[7, 5, 3]} size={3} speed={0.35} color="#9d8bff" opacity={0.7} />
      <ContactShadows position={[0, -2.25, 0]} opacity={0.28} scale={9} blur={2.8} far={3.5} color="#6d5bd0" frames={active ? Infinity : 1} />
    </Canvas>
  );
}
