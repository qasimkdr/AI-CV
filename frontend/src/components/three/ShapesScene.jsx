import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";

import { GlassShape, ResumeSheet, StudioLights } from "./parts";
import { usePointerRig } from "./rig";

function Rig({ pointer, withSheet }) {
  const rig = usePointerRig(pointer, [0.25, 0.15]);
  return (
    <group ref={rig}>
      {withSheet && (
        <ResumeSheet variant={0} layout={0} rotation={[0.1, -0.35, 0.06]} scale={0.95} />
      )}
      <GlassShape geometry="torus" color="#c4b5fd" position={[-1.6, 1.1, 0.4]} scale={1} />
      <GlassShape geometry="sphere" color="#bae6fd" position={[1.6, -1.2, 0.5]} scale={0.9} speed={1.1} />
      <GlassShape geometry="ico" color="#fbcfe8" position={[1.4, 1.5, -0.4]} scale={0.6} speed={1.8} />
      <GlassShape geometry="knot" color="#99f6e4" position={[-1.3, -1.5, 0.2]} scale={0.7} speed={1.2} />
      <GlassShape geometry="capsule" color="#fde68a" position={[0.2, 2.0, -0.8]} scale={0.7} speed={1.5} />
    </group>
  );
}

export default function ShapesScene({ active = true, withSheet = true }) {
  const pointer = useRef({ x: 0, y: 0 });

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
      dpr={[1, 1.6]}
      frameloop={active ? "always" : "demand"}
      camera={{ position: [0, 0, 6.5], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <StudioLights />
      <Rig pointer={pointer} withSheet={withSheet} />
      <Sparkles count={40} scale={[7, 6, 3]} size={2.6} speed={0.3} color="#9d8bff" opacity={0.6} />
    </Canvas>
  );
}
