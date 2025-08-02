// Reusable Card component

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const classes = [
    'bg-white rounded-lg border border-gray-200 shadow-sm',
    hover ? 'hover:shadow-md transition-shadow cursor-pointer' : '',
    paddingClasses[padding],
    className,
  ].join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
};