import React from 'react';
import { cn } from './Container';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  as?: React.ElementType;
}

/**
 * Reusable Grid component for consistent responsive columns.
 * Defaults to 1 column on mobile, scaling up to `columns` prop on desktop.
 */
export function Grid({ 
  className, 
  children, 
  columns = 3, 
  gap = 'lg',
  as: Component = 'div',
  ...props 
}: GridProps) {
  
  const gapClasses = {
    sm: 'gap-3 md:gap-4',
    md: 'gap-4 md:gap-6',
    lg: 'gap-6 md:gap-8 lg:gap-10',
    xl: 'gap-8 md:gap-12 lg:gap-16',
  };

  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <Component
      className={cn(
        'grid w-full',
        gapClasses[gap],
        colClasses[columns],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
