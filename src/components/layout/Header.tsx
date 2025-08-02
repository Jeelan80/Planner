// Header component for the application

import React from 'react';
import { Goal, Calendar, Settings } from 'lucide-react';

interface HeaderProps {
  title?: string;
  onSettingsClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = 'Auto Goal Planner',
  onSettingsClick 
}) => {
  return (
    <header className="header-gradient shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg icon-float">
              <Goal className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gradient">
              {title}
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button className="flex items-center space-x-2 text-white/80 hover:text-white transition-all duration-300 hover:scale-105">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">Today</span>
            </button>
            <button className="flex items-center space-x-2 text-white/80 hover:text-white transition-all duration-300 hover:scale-105">
              <Goal className="w-4 h-4" />
              <span className="font-medium">Goals</span>
            </button>
          </nav>

          {/* Settings */}
          <button
            onClick={onSettingsClick}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};