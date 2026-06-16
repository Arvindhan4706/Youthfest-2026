'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

interface SponsorNode {
  name: string;
  tier: 'Title' | 'Gold' | 'Energy Partner';
  color: string;
  position: [number, number, number];
  description: string;
}

const SPONSORS: SponsorNode[] = [
  { name: 'Intel', tier: 'Title', color: '#0068b5', position: [-2.5, 0, 0], description: 'Powering the Next-Gen technical events and coding labs.' },
  { name: 'RedBull', tier: 'Energy Partner', color: '#da0c32', position: [0, 0.5, 0], description: 'Fuelling the night-long hackathons and gaming tourneys.' },
  { name: 'GitHub', tier: 'Gold', color: '#24292e', position: [2.5, 0, 0], description: 'Supporting collaboration and open source student developer badges.' }
];

function InteractiveCube({
  sponsor,
  onHover,
}: {
  sponsor: SponsorNode;
  onHover: (s: SponsorNode | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Gentle spin
      meshRef.current.rotation.x += delta * 0.4;
      meshRef.current.rotation.y += delta * 0.6;
      
      // Float up and down
      if (sponsor.name === 'RedBull') {
        meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.15 + 0.5;
      } else {
        meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.2) * 0.1;
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={sponsor.position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover(sponsor);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(null);
        document.body.style.cursor = 'auto';
      }}
    >
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      <meshStandardMaterial
        color={sponsor.color}
        roughness={0.1}
        metalness={0.9}
        emissive={sponsor.color}
        emissiveIntensity={hovered ? 2.5 : 0.4}
      />
      
      <Html distanceFactor={8} position={[0, 0.9, 0]} center>
        <div className="bg-black/90 border border-white/10 px-2.5 py-1 rounded-md text-[10px] font-bold text-white whitespace-nowrap shadow-lg">
          {sponsor.name}
        </div>
      </Html>
    </mesh>
  );
}

export default function SponsorCube3D({
  onHoverSponsor,
}: {
  onHoverSponsor: (s: SponsorNode | null) => void;
}) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 2, 5.5], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#a855f7" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#3b82f6" />
        
        {SPONSORS.map((s, idx) => (
          <InteractiveCube key={idx} sponsor={s} onHover={onHoverSponsor} />
        ))}

        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
export type { SponsorNode };
