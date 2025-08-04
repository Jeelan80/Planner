// Header component for the application

import React from 'react';
import { Goal, Calendar, Settings } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

interface HeaderProps {
  title?: string;
  onSettingsClick?: () => void;
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = 'Auto Goal Planner',
  onSettingsClick,
  onLogoClick
}) => {
  return (
    <header className="header-modern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title - clickable to go to dashboard */}
          <button
            className="flex items-center space-x-3 focus:outline-none bg-transparent border-none p-2 m-0 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-200"
            onClick={onLogoClick}
            aria-label="Go to Dashboard"
            type="button"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl shadow-lg icon-float">
              <Goal className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
          </button>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <button className="nav-pill flex items-center space-x-2 px-4 py-2 transition-all duration-300">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">Today</span>
            </button>
            <button className="nav-pill flex items-center space-x-2 px-4 py-2 transition-all duration-300">
              <Goal className="w-4 h-4" />
              <span className="font-medium">Goals</span>
            </button>
          </nav>

          {/* Theme Toggle and Settings */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <button
              onClick={onSettingsClick}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/20 dark:hover:bg-white/10 rounded-lg transition-all duration-300"
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