'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import * as THREE from 'three';

function Universe(props: any) {
  const ref = useRef<THREE.Points>(null);
  
  // Generate 5000 points within a sphere of radius 1.5
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000 * 3), { radius: 1.5 }) as Float32Array);
  
  // Assign random neon colors to each particle
  const [colors] = useState(() => {
    const colorArray = new Float32Array(5000 * 3);
    const colorPalette = [
      new THREE.Color('#00E5FF'), // Neon Cyan
      new THREE.Color('#6C63FF'), // Neon Violet
      new THREE.Color('#8B5CF6'), // Primary Purple
    ];
    
    for (let i = 0; i < 5000; i++) {
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      color.toArray(colorArray, i * 3);
    }
    return colorArray;
  });

  useFrame((state, delta) => {
    if (ref.current) {
      // 1. Slow continuous rotation for the "living" feel
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;

      // 2. Interactive parallax based on mouse position
      // React Three Fiber's state.pointer gives normalized coordinates from -1 to 1
      const targetRotationY = state.pointer.x * 0.3;
      const targetRotationX = -state.pointer.y * 0.3;
      
      // Smoothly interpolate current rotation towards target rotation
      ref.current.rotation.y += (targetRotationY - ref.current.rotation.y) * 0.05;
      ref.current.rotation.x += (targetRotationX - ref.current.rotation.x) * 0.05;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} colors={colors} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          vertexColors
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

export default function ParticleUniverse() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Universe />
      </Canvas>
    </div>
  );
}
