import React from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '../common/Button';

interface CustomizationButtonProps {
  isCustomizing: boolean;
  onClick: () => void;
  className?: string;
}

export const CustomizationButton: React.FC<CustomizationButtonProps> = ({
  isCustomizing,
  onClick,
  className = '',
}) => {
  return (
    <Button
      onClick={onClick}
      size="sm"
      variant={isCustomizing ? "outline" : "primary"}
      className={`
        bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm 
        border-2 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl
        ${isCustomizing 
          ? 'border-red-300 dark:border-red-600 !text-red-700 dark:!text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30' 
          : 'border-purple-300 dark:border-purple-600 !text-purple-700 dark:!text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30'
        }
        ${className}
      `}
      title={isCustomizing ? "Exit Customization" : "Customize Dashboard"}
    >
      {isCustomizing ? (
        <>
          <X className="w-4 h-4 mr-1" />
          Done
        </>
      ) : (
        <>
          <Plus className="w-4 h-4 mr-1" />
          Customize
        </>
      )}
    </Button>
  );
};