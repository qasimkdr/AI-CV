import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, RoundedBox } from "@react-three/drei";

import { SHEET_VARIANTS } from "./variants";
import { makeResumeTexture } from "./texture";


/* ---------------------------------------------------------------
   Scene building blocks
   --------------------------------------------------------------- */

export function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} color="#ffffff" />
      <directionalLight position={[-4, -2, 2]} intensity={0.6} color="#c4b5fd" />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 4, 3]} scale={[8, 3, 1]} />
        <Lightformer form="circle" intensity={2.4} color="#c4b5fd" position={[-5, 1, 1]} scale={4} />
        <Lightformer form="circle" intensity={2.2} color="#bae6fd" position={[5, -1, 1]} scale={4} />
        <Lightformer form="rect" intensity={1.6} color="#fbcfe8" position={[0, -4, 2]} scale={[8, 2, 1]} />
      </Environment>
    </>
  );
}

export function GlassShape({
  geometry = "sphere",
  color = "#c4b5fd",
  position,
  scale = 1,
  speed = 1.4,
}) {
  const ref = useRef();
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.x += dt * 0.15 * speed;
    ref.current.rotation.y += dt * 0.22 * speed;
  });

  return (
    <Float speed={speed} rotationIntensity={0.6} floatIntensity={1.1}>
      <mesh ref={ref} position={position} scale={scale}>
        {geometry === "sphere" && <sphereGeometry args={[0.5, 48, 48]} />}
        {geometry === "torus" && <torusGeometry args={[0.42, 0.16, 32, 96]} />}
        {geometry === "ico" && <icosahedronGeometry args={[0.5, 0]} />}
        {geometry === "knot" && <torusKnotGeometry args={[0.32, 0.11, 128, 24]} />}
        {geometry === "capsule" && <capsuleGeometry args={[0.22, 0.5, 12, 24]} />}
        <meshPhysicalMaterial
          color={color}
          roughness={0.08}
          metalness={0.05}
          transmission={0.92}
          thickness={1.1}
          ior={1.35}
          clearcoat={1}
          clearcoatRoughness={0.1}
          iridescence={0.8}
          iridescenceIOR={1.3}
          attenuationColor={color}
          attenuationDistance={1.5}
        />
      </mesh>
    </Float>
  );
}

export function SkillChip({ position, color = "#ede9ff", accent = "#7c5cff", width = 0.9, rotation = [0, 0, 0] }) {
  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.9}>
      <group position={position} rotation={rotation}>
        <RoundedBox args={[width, 0.3, 0.08]} radius={0.14} smoothness={6}>
          <meshPhysicalMaterial color={color} roughness={0.25} clearcoat={1} />
        </RoundedBox>
        <mesh position={[-width / 2 + 0.17, 0, 0.045]}>
          <circleGeometry args={[0.06, 24]} />
          <meshBasicMaterial color={accent} toneMapped={false} />
        </mesh>
        <mesh position={[0.06, 0, 0.045]}>
          <planeGeometry args={[width - 0.5, 0.07]} />
          <meshBasicMaterial color={accent} toneMapped={false} transparent opacity={0.7} />
        </mesh>
      </group>
    </Float>
  );
}

/** A thin paper sheet with a procedurally drawn resume on both faces. */
export function ResumeSheet({ variant = 0, layout = 0, sheetRef, frontRef, backRef, tint, ...props }) {
  const texture = useMemo(
    () => makeResumeTexture(SHEET_VARIANTS[variant % SHEET_VARIANTS.length], layout),
    [variant, layout]
  );

  const W = 2;
  const H = 2.83;

  return (
    <group ref={sheetRef} {...props}>
      <RoundedBox args={[W + 0.04, H + 0.04, 0.03]} radius={0.03} smoothness={4}>
        <meshPhysicalMaterial color={tint || "#ffffff"} roughness={0.35} clearcoat={0.6} />
      </RoundedBox>
      <mesh ref={frontRef} position={[0, 0, 0.0165]}>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <mesh ref={backRef} position={[0, 0, -0.0165]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}
