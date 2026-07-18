'use client';
import React, { useEffect, useRef, useState } from 'react';
interface LazySceneProps {
 children: React.ReactNode;
 /** Placeholder height in px while scene hasn't mounted yet */
 placeholderHeight?: number;
 /** How far before the viewport edge to start loading (default 400px) */
 rootMargin?: string;
}
/**
 * LazyScene – mounts its children only when they approach the viewport.
 * This is critical for iOS Safari which has a strict ~300MB memory cap.
 * Without this, all 12 scenes mount simultaneously and the tab is killed.
 */
export default function LazyScene({
 children,
 placeholderHeight = 600,
 rootMargin = '400px',
}: LazySceneProps) {
 const [mounted, setMounted] = useState(false);
 const sentinelRef = useRef<HTMLDivElement>(null);
 useEffect(() => {
 const el = sentinelRef.current;
 if (!el) return;
 const observer = new IntersectionObserver(
 ([entry]) => {
 if (entry.isIntersecting) {
 setMounted(true);
 observer.disconnect(); // only need to fire once
 }
 },
 { rootMargin }
 );
 observer.observe(el);
 return () => observer.disconnect();
 }, [rootMargin]);
 if (!mounted) {
 return (
 <div
 ref={sentinelRef}
 style={{ minHeight: placeholderHeight }}
 aria-hidden="true"
 />
 );
 }
 return <>{children}</>;
}
