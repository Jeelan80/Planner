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

interface GoalAnalysis {
  parsedGoal: {
    title: string;
    timeframe: number;
    dailyTime: number;
    category: 'learning' | 'fitness' | 'project' | 'skill' | 'habit' | 'urgent';
  };
  strategies: PlanningStrategy[];
}

interface AIGoalPlannerCardProps {
  onStrategySelected?: (strategy: PlanningStrategy, analysis: GoalAnalysis) => void;
}

export const AIGoalPlannerCard: React.FC<AIGoalPlannerCardProps> = ({ onStrategySelected }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const examples = [
    "Learn Python in 20 days, 2 hrs/day",
    "Finish 10 DSA topics in 15 days",
    "Lose 3kg in 30 days with 45min daily walks",
    "Finish college project in 10 days, 3hr per day",
    "Finish 4 books in 30 days, 1hr/day",
  ];

  // This function will be called when a strategy is selected in the modal
  const handleStrategySelected = (strategy: PlanningStrategy, analysis: GoalAnalysis) => {
    // Close the modal first
    setIsModalOpen(false);
    
    // Call the parent's strategy selected handler if provided
    if (onStrategySelected) {
      onStrategySelected(strategy, analysis);
    } else {
      console.log('Strategy selected:', strategy.name, 'for goal:', analysis.parsedGoal.title);
    }
  };

  return (
    <>
      <div className="neon-border-wrapper mx-auto w-full max-w-4xl">
        <Card className="relative overflow-hidden w-full flex flex-col items-center p-6 sm:p-8 rounded-3xl shadow-2xl ai-goal-card-light">
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Focused Card Section */}
        <div className="mb-4 w-full max-w-lg mx-auto">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg mb-3 icon-float">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-3xl font-bold !text-slate-900 dark:!text-white flex items-center space-x-2 mb-3 text-center">
              <span>What's Your Goal?</span>
              <Sparkles className="w-6 h-6 !text-indigo-600 dark:!text-purple-400" />
            </h3>
            <p className="!text-slate-600 dark:!text-white/90 mb-6 text-center text-lg font-medium leading-relaxed">
              Click below to open our AI-powered goal planning assistant
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative w-full max-w-xs overflow-hidden rounded-full bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 p-0.5 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
            >
              <div className="relative flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-purple-600 px-8 py-4 text-lg font-bold !text-white transition-all duration-300 group-hover:from-purple-400 group-hover:via-blue-400 group-hover:to-purple-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 animate-shimmer"></div>
                <Brain className="w-6 h-6 !text-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <span className="relative z-10 tracking-wide !text-white">Plan My Goal</span>
                <div className="absolute right-4 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                  <Sparkles className="w-5 h-5 !text-white" />
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Examples section */}
        <div className="mb-6 flex flex-col items-center w-full">
          <p className="text-sm font-semibold !text-slate-500 dark:!text-white/70 mb-4 flex items-center space-x-2 justify-center">
            <Target className="w-4 h-4 !text-indigo-500 dark:!text-purple-400" />
            <span>Try examples like:</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-2xl justify-center">
            {examples.map((example, index) => (
              <button
                type="button"
                key={index}
                className="!bg-white/60 dark:!bg-white/10 border !border-white/40 dark:!border-white/20 rounded-xl px-4 py-3 shadow-sm flex items-center justify-center text-xs font-medium !text-slate-700 dark:!text-white/80 cursor-pointer transition-all duration-200 hover:!bg-white/80 dark:hover:!bg-white/20 hover:!border-indigo-300 dark:hover:!border-white/30 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-300 transform hover:scale-105 backdrop-blur-sm"
                aria-label={`Fill input with example: ${example}`}
              >
                <span className="text-center leading-tight">"{example}"</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI features highlight */}
        <div className="bg-white/40 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 !text-indigo-600 dark:!text-purple-400" />
            <span className="text-base font-semibold !text-slate-800 dark:!text-white">
              AI will analyze and suggest multiple planning strategies
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 !text-indigo-500 dark:!text-purple-300" />
              <span className="text-sm font-medium !text-slate-700 dark:!text-white/80">Time optimization</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 !text-indigo-500 dark:!text-purple-300" />
              <span className="text-sm font-medium !text-slate-700 dark:!text-white/80">Goal breakdown</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 !text-indigo-500 dark:!text-purple-300" />
              <span className="text-sm font-medium !text-slate-700 dark:!text-white/80">Smart scheduling</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 !text-indigo-500 dark:!text-purple-300" />
              <span className="text-sm font-medium !text-slate-700 dark:!text-white/80">Strategy suggestions</span>
            </div>
          </div>
        </div>
      </div>
      </Card>
      </div>

      {/* Goal Planning Modal */}
      <GoalPlanningModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStrategySelected={handleStrategySelected}
      />
    </>
  );
};
