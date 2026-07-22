import { useState, useEffect } from 'react';

export function useDevice() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [dpr, setDpr] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768 || ('ontouchstart' in window);
      const lowCores = typeof navigator !== 'undefined' && (navigator.hardwareConcurrency || 4) <= 4;
      const pixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      setIsMobile(mobile);
      setDpr(pixelRatio);
      setIsLowPerformance(mobile || lowCores || reducedMotion);
      setIsInitialized(true);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { isMobile, isLowPerformance, dpr, isInitialized };
}
