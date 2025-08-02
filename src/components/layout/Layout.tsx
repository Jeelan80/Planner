// Main layout component

import React from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  onSettingsClick?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title,
  onSettingsClick 
}) => {
  return (
    <div className="min-h-screen">
      <Header title={title} onSettingsClick={onSettingsClick} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="footer border-t border-white/10 mt-auto">
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