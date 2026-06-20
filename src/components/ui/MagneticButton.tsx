'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number; // How far the button follows the cursor
}

export default function MagneticButton({ children, className = '', strength = 30 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Raw cursor position relative to button center
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the movement using spring physics for that Apple-style feel
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    
    // Calculate distance from center of element
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    // Set new target position based on strength
    x.set(middleX * (strength / 100));
    y.set(middleY * (strength / 100));
  };

  const reset = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
