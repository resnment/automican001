'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

type Hub = {
  position: THREE.Vector3;
  energy: number;
};

type Agent = {
  from: number;
  to: number;
  progress: number;
  speed: number;
  arc: number;
};

const TEAL = '#00f2ff';
const VIOLET = '#8b5cf6';
const BG = '#050505';

function generateHubs(count = 36): Hub[] {
  const hubs: Hub[] = [];

  for (let i = 0; i < count; i++) {
    const ring = i % 3;
    const ringRadius = 3.2 + ring * 1.65;
    const angle = (i / count) * Math.PI * 2 * (ring + 1.15);
    const y = (ring - 1) * 1.25 + Math.sin(i * 1.7) * 0.45;

    const x = Math.cos(angle) * ringRadius;
    const z = Math.sin(angle) * ringRadius;

    hubs.push({
      position: new THREE.Vector3(x, y, z),
      energy: 0.6 + Math.random() * 1.1,
    });
  }

  hubs.push(
    { position: new THREE.Vector3(0, 0, 0), energy: 2 },
    { position: new THREE.Vector3(0, 2.3, 0), energy: 1.8 },
    { position: new THREE.Vector3(0, -2.3, 0), energy: 1.8 },
  );

  return hubs;
}

function buildNeighborhood(hubs: Hub[], k = 3): number[][] {
  return hubs.map((hub, i) => {
    const nearest = hubs
      .map((other, j) => ({ j, d: hub.position.distanceToSquared(other.position) }))
      .filter((entry) => entry.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, k)
      .map((entry) => entry.j);

    return nearest;
  });
}

function NationGraph({ hubs, neighborhood }: { hubs: Hub[]; neighborhood: number[][] }) {
  const links = useMemo(() => {
    const positions: number[] = [];
    const seen = new Set<string>();

    for (let from = 0; from < neighborhood.length; from++) {
      for (const to of neighborhood[from]) {
        const key = from < to ? `${from}-${to}` : `${to}-${from}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const a = hubs[from].position;
        const b = hubs[to].position;

        positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [hubs, neighborhood]);

  return (
    <lineSegments geometry={links}>
      <lineBasicMaterial color={VIOLET} transparent opacity={0.35} blending={THREE.AdditiveBlending} />
    </lineSegments>
  );
}

function HubField({ hubs }: { hubs: Hub[] }) {
  return (
    <group>
      {hubs.map((hub, i) => (
        <Float key={i} speed={0.45 + hub.energy * 0.2} rotationIntensity={0.4} floatIntensity={0.5}>
          <mesh position={hub.position}>
            <icosahedronGeometry args={[0.07 + hub.energy * 0.05, 1]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? TEAL : VIOLET}
              emissive={i % 2 === 0 ? TEAL : VIOLET}
              emissiveIntensity={0.9 + hub.energy * 0.5}
              metalness={0.7}
              roughness={0.15}
              toneMapped={false}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function AgentSwarm({ hubs, neighborhood, count = 120 }: { hubs: Hub[]; neighborhood: number[][]; count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const agents = useMemo<Agent[]>(() => {
    return new Array(count).fill(0).map(() => {
      const from = Math.floor(Math.random() * hubs.length);
      const choices = neighborhood[from];
      const to = choices[Math.floor(Math.random() * choices.length)] ?? from;
      return {
        from,
        to,
        progress: Math.random(),
        speed: 0.25 + Math.random() * 0.6,
        arc: 0.25 + Math.random() * 0.9,
      };
    });
  }, [count, hubs.length, neighborhood]);

  useFrame((state, delta) => {
    if (!ref.current) return;

    const t = state.clock.elapsedTime;

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];
      agent.progress += delta * agent.speed;

      if (agent.progress >= 1) {
        agent.from = agent.to;
        const nextChoices = neighborhood[agent.from];
        agent.to = nextChoices[Math.floor(Math.random() * nextChoices.length)] ?? agent.from;
        agent.progress = 0;
        agent.speed = 0.25 + Math.random() * 0.6;
      }

      const from = hubs[agent.from].position;
      const to = hubs[agent.to].position;
      const p = agent.progress;

      const x = THREE.MathUtils.lerp(from.x, to.x, p);
      const y = THREE.MathUtils.lerp(from.y, to.y, p) + Math.sin(p * Math.PI) * agent.arc;
      const z = THREE.MathUtils.lerp(from.z, to.z, p);

      dummy.position.set(x, y, z);
      const s = 0.022 + 0.013 * (1 + Math.sin(t * 2.4 + i * 0.19));
      dummy.scale.setScalar(s);
      dummy.lookAt(to);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }

    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={1.1} toneMapped={false} metalness={0.5} roughness={0.2} />
    </instancedMesh>
  );
}

function DataHalo() {
  const points = useMemo(() => {
    const total = 800;
    const position = new Float32Array(total * 3);

    for (let i = 0; i < total; i++) {
      const r = 4.5 + Math.random() * 3.8;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 3.4;

      position[i * 3] = Math.cos(theta) * r;
      position[i * 3 + 1] = y;
      position[i * 3 + 2] = Math.sin(theta) * r;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
    return geometry;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.04;
    ref.current.rotation.x += delta * 0.012;
  });

  return (
    <points ref={ref} geometry={points}>
      <pointsMaterial
        color={VIOLET}
        size={0.025}
        sizeAttenuation
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function NationScene() {
  const hubs = useMemo(() => generateHubs(), []);
  const neighborhood = useMemo(() => buildNeighborhood(hubs, 3), [hubs]);

  return (
    <>
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 9, 22]} />

      <PerspectiveCamera makeDefault position={[0, 3.8, 11]} fov={45} />

      <ambientLight intensity={0.35} color={VIOLET} />
      <pointLight position={[0, 4.5, 5.5]} intensity={40} distance={24} color={TEAL} />
      <pointLight position={[-6, -2, -5]} intensity={24} distance={30} color={VIOLET} />

      <group rotation={[0.2, 0, 0]}>
        <NationGraph hubs={hubs} neighborhood={neighborhood} />
        <HubField hubs={hubs} />
        <AgentSwarm hubs={hubs} neighborhood={neighborhood} />
        <DataHalo />
      </group>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.32}
        minPolarAngle={Math.PI * 0.34}
        maxPolarAngle={Math.PI * 0.67}
      />
    </>
  );
}

export default function AutomicanAgentNationHero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  return (
    <div
      style={{
        width: '100%',
        aspectRatio: isMobile ? '1 / 1' : '16 / 9',
        minHeight: isMobile ? 340 : 460,
        background: 'radial-gradient(circle at 50% 40%, rgba(139,92,246,0.14) 0%, rgba(0,0,0,0) 58%), #050505',
        borderRadius: 18,
        overflow: 'hidden',
        border: '1px solid rgba(139, 92, 246, 0.22)',
      }}
    >
      <Canvas dpr={[1, 1.8]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <NationScene />
      </Canvas>
    </div>
  );
}
