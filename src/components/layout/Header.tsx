// Header component for the application

import React from 'react';
import { Goal, Settings } from 'lucide-react';
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
    <header className="modern-navbar">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <button
            className="flex items-center space-x-3 focus:outline-none bg-transparent border-none p-2 rounded-xl hover:bg-white/5 dark:hover:bg-white/5 transition-all duration-300 group"
            onClick={onLogoClick}
            aria-label="Go to Dashboard"
            type="button"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105">
              <Goal className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col items-start">
              <h1 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
                Auto Goal Planner
              </h1>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                AI-Powered Planning
              </span>
            </div>
          </button>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-xl p-1.5 border border-white/20 dark:border-white/10">
              <ThemeToggle />
              <button
                onClick={onSettingsClick}
                className="p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/20 dark:hover:bg-white/10 rounded-lg transition-all duration-300"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};