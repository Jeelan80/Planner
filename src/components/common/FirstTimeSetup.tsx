// Component for first-time user name setup

import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { User, Sparkles } from 'lucide-react';

interface FirstTimeSetupProps {
  onNameSubmit: (name: string) => void;
}

export const FirstTimeSetup: React.FC<FirstTimeSetupProps> = ({ onNameSubmit }) => {
  const [inputName, setInputName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputName.trim()) {
      onNameSubmit(inputName.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="max-w-md w-full mx-4">
        <div className="text-center space-y-6">
          {/* Welcome Icon */}
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Welcome Message */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Goal Planner!
            </h2>
            <p className="text-gray-600">
              What should I call you? This will personalize your experience.
            </p>
          </div>

          {/* Name Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-center text-lg"
                autoFocus
                maxLength={50}
              />
            </div>

            <Button
              type="submit"
              disabled={!inputName.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Get Started
            </Button>
          </form>

          <p className="text-xs text-gray-500">
            You can change this anytime by clicking on your name.
          </p>
        </div>
      </Card>
    </div>
  );
};
