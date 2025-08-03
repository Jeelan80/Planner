// Main layout component

import React from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  onSettingsClick?: () => void;
  onLogoClick?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title,
  onSettingsClick,
  onLogoClick
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header title={title} onSettingsClick={onSettingsClick} onLogoClick={onLogoClick} />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 main-content">
        {children}
      </main>
      {/* Footer */}
      <footer className="footer border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-sm font-medium text-white/90 mb-2">
              Auto Goal Planner
            </p>
            <p className="text-xs text-white/60">
              Plan Smart • Track Progress • Achieve More
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};