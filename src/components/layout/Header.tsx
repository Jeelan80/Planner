// Header component for the application

import React from 'react';
import { Goal, Calendar, Settings } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

interface HeaderProps {
  title?: string;
  onSettingsClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = 'Auto Goal Planner',
  onSettingsClick 
}) => {
  return (
    <header className="header-modern shadow-sm border-b border-gray-100 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl shadow-lg">
              <Goal className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white dark:text-white">
              {title}
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <button className="nav-pill flex items-center space-x-2 px-4 py-2 text-white/90 hover:text-white transition-all duration-300">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">Today</span>
            </button>
            <button className="nav-pill flex items-center space-x-2 px-4 py-2 text-white/90 hover:text-white transition-all duration-300">
              <Goal className="w-4 h-4" />
              <span className="font-medium">Goals</span>
            </button>
          </nav>

          {/* Theme Toggle and Settings */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <button
              onClick={onSettingsClick}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};