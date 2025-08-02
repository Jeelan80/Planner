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
    <div className="min-h-screen bg-gray-50">
      <Header title={title} onSettingsClick={onSettingsClick} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            Auto Goal Planner - Plan, Track, Achieve
          </p>
        </div>
      </footer>
    </div>
  );
};