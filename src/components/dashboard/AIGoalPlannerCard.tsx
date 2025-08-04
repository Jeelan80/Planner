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
    console.log('Strategy selected:', strategy, analysis);
    // This will be handled by the parent component later
  };

  return (
    <>
      <Card className="relative overflow-hidden mx-auto w-full max-w-3xl min-h-[600px] flex flex-col justify-start items-center p-10 rounded-3xl shadow-2xl border-2 border-purple-300 card-gradient mt-32">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
        <div className="absolute top-4 right-4 w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute top-8 right-12 w-4 h-4 bg-purple-500 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-12 right-6 w-6 h-6 bg-pink-500 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Focused Card Section */}
        <div className="mb-8 w-full max-w-md mx-auto">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg mb-2">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white dark:text-white flex items-center space-x-2 mb-1">
              <span>What's Your Goal?</span>
              <Sparkles className="w-6 h-6 text-purple-400 dark:text-purple-300" />
            </h3>
            <p className="text-white/80 mb-4 text-center">
              Click below to open our AI-powered goal planning assistant
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="btn-gradient text-white font-semibold py-2 px-6 text-base shadow-lg hover:shadow-xl transition-all duration-300 w-full"
              icon={Brain}
            >
              Plan My Goal
            </Button>
          </div>
        </div>

        {/* Examples section */}
        <div className="mb-6 flex flex-col items-center w-full">
          <p className="text-sm font-semibold text-slate-400 dark:text-slate-300 mb-2 flex items-center space-x-2 justify-center">
            <Target className="w-4 h-4 text-purple-500" />
            <span>Try examples like:</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full max-w-lg justify-center">
            {examples.map((example, index) => (
              <button
                type="button"
                key={index}
                className="bg-slate-800/60 dark:bg-slate-700/60 border border-purple-400 dark:border-purple-500 rounded-2xl px-2 py-1 shadow-sm flex items-center space-x-1 text-xs min-w-[120px] max-w-[180px] justify-center cursor-pointer transition hover:bg-slate-700/80 dark:hover:bg-slate-600/80 focus:outline-none focus:ring-2 focus:ring-purple-300"
                aria-label={`Fill input with example: ${example}`}
              >
                <span className="text-slate-300 dark:text-slate-200 font-medium">"{example}"</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI features highlight */}
        <div className="ai-planning-card mb-6">
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
