import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Smoothly follows the pointer (tracked on window, not just the canvas). */
export function usePointerRig(pointer, strength = [0.35, 0.22]) {
  const ref = useRef();
  useFrame(() => {
    if (!ref.current) return;
    const g = ref.current;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, pointer.current.x * strength[0], 0.05);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -pointer.current.y * strength[1], 0.05);
  });
  return ref;
}
