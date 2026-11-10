import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, Sparkles } from "@react-three/drei";
import * as THREE from "three";

import { ResumeSheet } from "../three/parts";
import { usePointerRig } from "../three/rig";

// Aurora palette — deliberately no purple/violet.
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uDone;
  uniform float uSize;
  attribute float aRand;
  varying vec3 vColor;
  varying float vAlpha;

  const vec3 TEAL    = vec3(0.078, 0.722, 0.651);
  const vec3 CYAN    = vec3(0.024, 0.714, 0.831);
  const vec3 SKY     = vec3(0.220, 0.741, 0.973);
  const vec3 EMERALD = vec3(0.063, 0.725, 0.506);
  const vec3 GOLD    = vec3(0.961, 0.620, 0.043);

  vec3 palette(float k) {
    if (k < 0.25) return mix(TEAL, CYAN, k * 4.0);
    if (k < 0.5)  return mix(CYAN, SKY, (k - 0.25) * 4.0);
    if (k < 0.75) return mix(SKY, EMERALD, (k - 0.5) * 4.0);
    return mix(EMERALD, GOLD, (k - 0.75) * 4.0);
  }

  void main() {
    vec3 p = position;
    float t = uTime * 0.55;
    float w = sin(p.x * 0.42 + t) * 0.65
            + cos(p.z * 0.55 + t * 0.8) * 0.5
            + sin((p.x + p.z) * 0.23 + t * 1.35) * 0.35;
    p.y += w;

    // When the AI answers: everything rushes into the sheet, then bursts.
    float gather = smoothstep(0.0, 0.55, uDone);
    float burst = smoothstep(0.55, 1.0, uDone);
    vec3 core = vec3(0.0, 1.6, 0.0) + normalize(p - vec3(0.0, 1.6, 0.0) + 0.0001) * (0.15 + aRand * 0.25);
    p = mix(p, core, gather);
    p = mix(p, vec3(0.0, 1.6, 0.0) + (p - vec3(0.0, 1.6, 0.0)) * (1.0 + aRand * 22.0), burst);

    float k = fract(p.x * 0.035 + uTime * 0.04 + w * 0.12 + aRand * 0.08);
    vColor = palette(k);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * (0.55 + aRand * 0.9) * (10.0 / -mv.z) * (1.0 + gather * 0.6);
    vAlpha = (0.55 + 0.45 * sin(uTime * 1.8 + aRand * 6.2831)) * (1.0 - burst);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.05, d);
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

// Deterministic pseudo-random so renders stay pure.
const hash = (n) => {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

function ParticleWave({ doneRef, count }) {
  const material = useRef();
  const { positions, rand } = useMemo(() => {
    const cols = Math.round(Math.sqrt(count * 1.7));
    const rows = Math.round(count / cols);
    const pos = new Float32Array(cols * rows * 3);
    const rnd = new Float32Array(cols * rows);
    let i = 0;
    for (let x = 0; x < cols; x++) {
      for (let z = 0; z < rows; z++) {
        pos[i * 3] = (x / (cols - 1) - 0.5) * 30 + (hash(i * 3.1) - 0.5) * 0.12;
        pos[i * 3 + 1] = 0;
        pos[i * 3 + 2] = (z / (rows - 1) - 0.5) * 18 - 2 + (hash(i * 7.7) - 0.5) * 0.12;
        rnd[i] = hash(i + 0.5);
        i++;
      }
    }
    return { positions: pos, rand: rnd };
  }, [count]);

  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uDone: { value: 0 }, uSize: { value: 2.6 } }), []);

  useFrame((_, dt) => {
    const u = material.current?.uniforms;
    if (!u) return;
    u.uTime.value += dt;
    u.uDone.value = THREE.MathUtils.lerp(u.uDone.value, doneRef.current ? 1 : 0, doneRef.current ? 0.035 : 0.1);
  });

  return (
    <points position={[0, -1.7, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRand" args={[rand, 1]} />
      </bufferGeometry>
      <shaderMaterial ref={material} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} transparent depthWrite={false} />
    </points>
  );
}

function ScanBeam() {
  const ref = useRef();
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 4;
    c.height = 128;
    const g = c.getContext("2d");
    const grad = g.createLinearGradient(0, 0, 0, 128);
    grad.addColorStop(0, "rgba(34,211,238,0)");
    grad.addColorStop(0.5, "rgba(34,211,238,0.85)");
    grad.addColorStop(0.56, "rgba(250,204,21,0.9)");
    grad.addColorStop(1, "rgba(34,211,238,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 4, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = Math.sin(clock.elapsedTime * 1.4) * 1.35;
  });

  return (
    <mesh ref={ref} position={[0, 0, 0.05]}>
      <planeGeometry args={[2.35, 0.42]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function Rings() {
  const a = useRef();
  const b = useRef();
  useFrame((_, dt) => {
    if (a.current) {
      a.current.rotation.z += dt * 0.35;
      a.current.rotation.x = 1.2 + Math.sin(performance.now() / 2400) * 0.15;
    }
    if (b.current) {
      b.current.rotation.z -= dt * 0.25;
      b.current.rotation.y += dt * 0.1;
    }
  });
  return (
    <>
      <mesh ref={a}>
        <torusGeometry args={[2.25, 0.012, 16, 160]} />
        <meshBasicMaterial color="#14b8a6" transparent opacity={0.75} />
      </mesh>
      <mesh ref={b} rotation={[1.6, 0.4, 0]}>
        <torusGeometry args={[2.6, 0.008, 16, 160]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.6} />
      </mesh>
    </>
  );
}

function Stage({ pointer, doneRef }) {
  const rig = usePointerRig(pointer, [0.22, 0.12]);
  const sheet = useRef();

  useFrame(({ clock }) => {
    if (!sheet.current) return;
    const t = clock.elapsedTime;
    const done = doneRef.current;
    sheet.current.rotation.y = THREE.MathUtils.lerp(sheet.current.rotation.y, done ? Math.PI * 2 : Math.sin(t * 0.5) * 0.25, done ? 0.06 : 0.05);
    const s = THREE.MathUtils.lerp(sheet.current.scale.x, done ? 1.12 : 1, 0.08);
    sheet.current.scale.setScalar(s);
  });

  return (
    <group ref={rig}>
      <Float speed={1.6} rotationIntensity={0.15} floatIntensity={0.6}>
        <group ref={sheet} position={[0, 1.6, 0]}>
          <ResumeSheet variant={1} layout={0} scale={0.9} />
          <group scale={0.9}>
            <ScanBeam />
          </group>
          <Rings />
        </group>
      </Float>
    </group>
  );
}

// Own lighting so no violet reflections leak in from the site's 3D scenes.
function AuroraLights() {
  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[3, 5, 4]} intensity={1.3} />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 4, 3]} scale={[8, 3, 1]} />
        <Lightformer form="circle" intensity={2.4} color="#99f6e4" position={[-5, 1, 1]} scale={4} />
        <Lightformer form="circle" intensity={2.2} color="#bae6fd" position={[5, -1, 1]} scale={4} />
        <Lightformer form="rect" intensity={1.6} color="#fde68a" position={[0, -4, 2]} scale={[8, 2, 1]} />
      </Environment>
    </>
  );
}

export default function AuroraScene({ done }) {
  const pointer = useRef({ x: 0, y: 0 });
  const doneRef = useRef(done);
  useEffect(() => {
    doneRef.current = done;
  }, [done]);
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
    <Canvas dpr={[1, compact ? 1.4 : 1.8]} camera={{ position: [0, 2.4, compact ? 11 : 8.6], fov: 42 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} style={{ background: "transparent" }} onCreated={({ camera }) => camera.lookAt(0, 0.9, 0)}>
      <AuroraLights />
      <ParticleWave doneRef={doneRef} count={compact ? 14000 : 32000} />
      <Stage pointer={pointer} doneRef={doneRef} />
      <Sparkles count={compact ? 40 : 80} scale={[12, 6, 6]} position={[0, 1.5, 0]} size={3.5} speed={0.5} color="#22d3ee" opacity={0.8} />
      <Sparkles count={compact ? 20 : 40} scale={[10, 5, 5]} position={[0, 1.5, 0]} size={4} speed={0.35} color="#fbbf24" opacity={0.7} />
    </Canvas>
  );
}
