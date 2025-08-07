// AI Goal Planner card component for the dashboard

import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Brain, Sparkles, Target, Clock, Zap } from 'lucide-react';
import { GoalPlanningModal } from './GoalPlanningModal';
// Type definitions for AI planner
interface DailyTask {
  day: number;
  task: string;
  duration: number;
}

interface PlanningStrategy {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  plan: DailyTask[];
  pros: string[];
  bestFor: string;
}

// Removed unused GoalAnalysis interface
export const AIGoalPlannerCard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const examples = [
    "Learn Python in 20 days, 2 hrs/day",
    "Finish 10 DSA topics in 15 days",
    "Lose 3kg in 30 days with 45min daily walks",
    "Finish college project in 10 days, 3hr per day",
    "Finish 4 books in 30 days, 1hr/day",
  ];

  // Use correct types for strategy and analysis
  const handleStrategySelected = (strategy: PlanningStrategy, analysis: { parsedGoal: { title: string; timeframe: number; dailyTime: number; category: string; }; strategies: PlanningStrategy[] }) => {
    // This will trigger the modal to open and handle the strategy selection
    setIsModalOpen(true);
  };

  return (
    <>
      <Card className="relative overflow-hidden mx-auto w-full max-w-4xl min-h-[500px] flex flex-col justify-center items-center p-8 sm:p-12 rounded-3xl shadow-2xl card-gradient mt-8">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
        <div className="absolute top-4 right-4 w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute top-8 right-12 w-4 h-4 bg-purple-500 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-12 right-6 w-6 h-6 bg-pink-500 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Focused Card Section */}
        <div className="mb-6 w-full max-w-lg mx-auto">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg mb-4 icon-float">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white dark:text-white flex items-center space-x-2 mb-3 text-center">
              <span>What's Your Goal?</span>
              <Sparkles className="w-6 h-6 text-purple-400 dark:text-purple-300" />
            </h3>
            <p className="text-white/90 mb-6 text-center text-lg font-medium">
              Click below to open our AI-powered goal planning assistant
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="btn-gradient text-white font-bold py-4 px-8 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 w-full max-w-xs transform hover:scale-105"
              icon={Brain}
            >
              Plan My Goal
            </Button>
          </div>
        </div>

        {/* Examples section */}
        <div className="mb-8 flex flex-col items-center w-full">
          <p className="text-sm font-semibold text-white/70 dark:text-white/80 mb-4 flex items-center space-x-2 justify-center">
            <Target className="w-4 h-4 text-purple-500" />
            <span>Try examples like:</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-2xl justify-center">
            {examples.map((example, index) => (
              <button
                type="button"
                key={index}
                className="bg-white/10 dark:bg-white/5 border border-white/30 dark:border-white/20 rounded-xl px-3 py-2 shadow-sm flex items-center justify-center text-xs font-medium text-white/90 dark:text-white/80 cursor-pointer transition-all duration-200 hover:bg-white/20 dark:hover:bg-white/10 hover:border-white/40 dark:hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-300 transform hover:scale-105"
                aria-label={`Fill input with example: ${example}`}
              >
                <span className="text-center leading-tight">"{example}"</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI features highlight */}
        <div className="ai-planning-card">
          <div className="ai-planning-card-title flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-purple-400" />
            AI will analyze and suggest multiple planning strategies
          </div>
          <div className="ai-planning-card-list">
            <div className="ai-planning-card-list-item">
              <Clock className="w-4 h-4 text-purple-300" />
              <span>Time optimization</span>
            </div>
            <div className="ai-planning-card-list-item">
              <Target className="w-4 h-4 text-purple-300" />
              <span>Goal breakdown</span>
            </div>
            <div className="ai-planning-card-list-item">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span>Smart scheduling</span>
            </div>
            <div className="ai-planning-card-list-item">
              <Brain className="w-4 h-4 text-purple-300" />
              <span>Strategy suggestions</span>
            </div>
          </div>
        </div>
      </div>
      </Card>

      {/* Goal Planning Modal */}
      <GoalPlanningModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStrategySelected={handleStrategySelected}
      />
    </>
  );
}
