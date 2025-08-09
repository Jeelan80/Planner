// Reusable Card component

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'solid';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  variant = 'glass',
  onClick,
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantClasses = {
    default: 'card-glass',
    glass: 'card-glass',
    solid: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg',
  };

  const classes = [
    variantClasses[variant],
    hover ? 'hover:shadow-md transition-shadow cursor-pointer' : '',
    paddingClasses[padding],
    className,
  ].join(' ');

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};