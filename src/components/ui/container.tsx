import React from 'react';
import cn from 'clsx';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * Simple responsive container (centered, with horizontal padding).
 */
export const Container: React.FC<ContainerProps> = ({ children, className, ...props }) => (
  <div className={cn('container mx-auto px-4', className)} {...props}>
    {children}
  </div>
);

