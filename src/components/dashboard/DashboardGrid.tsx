import React from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { DashboardCard } from '../../types/dashboard';
import { Button } from '../common/Button';

interface DashboardGridProps {
  cards: DashboardCard[];
  isCustomizing: boolean;
  onCustomizeClick: () => void;
  children?: React.ReactNode;
  className?: string;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  cards,
  isCustomizing,
  onCustomizeClick,
  children,
  className = '',
}) => {
  // Empty state when no cards exist
  if (cards.length === 0) {
    return (
      <div className={`min-h-[400px] flex items-center justify-center ${className}`}>
        <div className="text-center max-w-md mx-auto p-8">
          <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mx-auto mb-6 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-3">
            Customize Your Dashboard
          </h3>
          
          <p className="text-white/80 mb-6 leading-relaxed">
            Make this space truly yours! Add photo cards, motivational quotes, 
            project progress trackers, and more to create the perfect workspace.
          </p>
          
          <Button
            onClick={onCustomizeClick}
            className="btn-gradient text-white font-bold py-3 px-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Your First Card
          </Button>
          
          <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-white/60">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Personal photos</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Quick notes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Goal progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Task summaries</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid layout for cards
  return (
    <div className={`dashboard-grid ${className}`}>
      {/* Grid container with responsive layout */}
      <div className="w-full">
        {children}
      </div>
      
      {/* Add card button when customizing */}
      {isCustomizing && (
        <div className="mt-6 flex justify-center">
          <Button
            onClick={onCustomizeClick}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 border-dashed border-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another Card
          </Button>
        </div>
      )}
    </div>
  );
};