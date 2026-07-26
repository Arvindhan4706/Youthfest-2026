import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  as?: React.ElementType;
}

/**
 * Reusable Container for consistent max-width and responsive padding.
 * Enforces Desktop (1280px, 24px padding), Tablet (20px), Mobile (16px).
 */
export function Container({ className, children, as: Component = 'div', ...props }: ContainerProps) {
  return (
    <Component
      className={cn(
        'w-full max-w-7xl mx-auto px-4 md:px-5 lg:px-6',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
