// AI Goal Planner card component for the dashboard

import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Brain, Sparkles, Target, Clock, Zap } from 'lucide-react';

interface AIGoalPlannerCardProps {
  onStartAIPlanning: () => void;
}

export const AIGoalPlannerCard: React.FC<AIGoalPlannerCardProps> = ({
  onStartAIPlanning,
}) => {
  const examples = [
    "Learn Python in 20 days, 2 hrs/day",
    "Finish 10 DSA topics in 15 days",
    "Lose 3kg in 30 days with 45min daily walks",
    "Finish college project in 10 days, 3hr per day",
    "I have to give a speech in one hour"
  ];

  return (
    <Card className="relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div className="absolute top-4 right-4 w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute top-8 right-12 w-4 h-4 bg-purple-500 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-12 right-6 w-6 h-6 bg-pink-500 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
              <span>AI Goal Planner</span>
              <Sparkles className="w-5 h-5 text-purple-500" />
            </h3>
            <p className="text-sm text-slate-600 font-medium">Describe your goal naturally</p>
          </div>
        </div>

        {/* Examples section */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center space-x-2">
            <Target className="w-4 h-4 text-purple-500" />
            <span>Try examples like:</span>
          </p>
          <div className="space-y-2">
            {examples.map((example, index) => (
              <div key={index} className="flex items-start space-x-2 text-sm">
                <span className="text-purple-500 font-bold mt-0.5">•</span>
                <span className="text-slate-700 font-medium">"{example}"</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI features highlight */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6 border border-purple-100">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-800">AI will analyze and suggest multiple planning strategies</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-purple-700">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Time optimization</span>
            </div>
            <div className="flex items-center space-x-1">
              <Target className="w-3 h-3" />
              <span>Goal breakdown</span>
            </div>
            <div className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Smart scheduling</span>
            </div>
            <div className="flex items-center space-x-1">
              <Brain className="w-3 h-3" />
              <span>Strategy suggestions</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Button 
          onClick={onStartAIPlanning}
          className="w-full btn-gradient text-white font-semibold py-3 px-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          icon={Brain}
        >
          Start AI Goal Planning
        </Button>
      </div>
    </Card>
  );
};
