// Goal Planning Modal component for the dashboard

import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Brain, X, Target, Clock, Calendar, Sparkles, TrendingUp, Zap } from 'lucide-react';

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

interface ParsedGoal {
  title: string;
  timeframe: number;
  dailyTime: number;
  category: 'learning' | 'fitness' | 'project' | 'skill' | 'habit' | 'urgent';
}

interface GoalAnalysis {
  parsedGoal: ParsedGoal;
  strategies: PlanningStrategy[];
}

interface GoalPlanningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStrategySelected: (strategy: PlanningStrategy, analysis: GoalAnalysis) => void;
}

export const GoalPlanningModal: React.FC<GoalPlanningModalProps> = ({
  isOpen,
  onClose,
  onStrategySelected,
}) => {
  const [goalInput, setGoalInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<GoalAnalysis | null>(null);
  const [error, setError] = useState('');
  const [viewingStrategy, setViewingStrategy] = useState<PlanningStrategy | null>(null);
  const [editablePlan, setEditablePlan] = useState<DailyTask[]>([]);

  const examples = [
    "Learn Python in 20 days, 2 hrs/day",
    "Finish 10 DSA topics in 15 days",
    "Lose 3kg in 30 days with 45min daily walks",
    "Finish college project in 10 days, 3hr per day",
    "Finish 4 books in 30 days, 1hr/day",
  ];

  // Real API call to backend
  const analyzeGoal = async (input: string) => {
    setLoading(true);
    setError('');
    try {
      // Use relative URL - Vite proxy will route to backend
      const response = await fetch('/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: input })
      });
      let data;
      // Check for empty response
      const text = await response.text();
      if (!response.ok) {
        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          throw new Error('Failed to generate plan (invalid response from server)');
        }
        throw new Error((data && data.error) || 'Failed to generate plan');
      }
      if (!text) {
        throw new Error('Server returned empty response. Please try again later.');
      }
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Server returned invalid JSON. Please try again later.');
      }
      if (!data || Object.keys(data).length === 0) {
        throw new Error('Server returned empty plan. Please try again later.');
      }
      // Transform backend response to frontend format with proper validation
      const parsedGoal = {
        title: data.title || 'My Goal',
        timeframe: parseInt(data.duration) || 30, // Default to 30 days if NaN
        dailyTime: parseInt(data.dailyTime) || 120, // Default to 120 minutes if NaN
        category: 'skill' as 'learning' | 'fitness' | 'project' | 'skill' | 'habit' | 'urgent',
      };
      // Map backend strategies to frontend format
      const strategies: PlanningStrategy[] = [];
      if (data.strategies?.stepByStep) {
        strategies.push({
          id: 'step-by-step',
          name: 'Step-by-Step',
          icon: Target,
          description: 'Break your goal into fixed steps, spread evenly over time',
          plan: (data.strategies.stepByStep as Array<{ day?: number; week?: number; task?: string; focus?: string; minutes?: string|number }>).
            map(item => ({
              day: item.day || item.week || 1,
              task: item.task || item.focus || '',
              duration: item.minutes ? (typeof item.minutes === 'string' ? parseInt(item.minutes) || parsedGoal.dailyTime : item.minutes) : parsedGoal.dailyTime
            })),
          pros: ['Clear daily tasks', 'Easy to follow', 'Consistent progress'],
          bestFor: 'Beginners and structured learners',
        });
      }
      if (data.strategies?.progressiveLoad) {
        strategies.push({
          id: 'progressive',
          name: 'Progressive Load',
          icon: TrendingUp,
          description: 'Start light, gradually increase intensity over time',
          plan: (data.strategies.progressiveLoad as Array<{ day?: number; week?: number; focus?: string; task?: string; minutes?: string|number }>).
            map(item => ({
              day: item.day || item.week || 1,
              task: item.task || item.focus || '',
              duration: item.minutes ? (typeof item.minutes === 'string' ? parseInt(item.minutes) || parsedGoal.dailyTime : item.minutes) : parsedGoal.dailyTime
            })),
          pros: ['Builds momentum', 'Prevents burnout', 'Sustainable'],
          bestFor: 'Long-term goals and habit formation',
        });
      }
      if (data.strategies?.milestoneBased) {
        strategies.push({
          id: 'milestone',
          name: 'Milestone-Oriented',
          icon: Zap,
          description: 'Set major checkpoints with mini-deadlines',
          plan: (data.strategies.milestoneBased as Array<{ day?: number; due?: string; milestone?: string; task?: string; minutes?: string|number }>).
            map(item => ({
              day: item.day || (item.due ? parseInt(item.due.replace(/\D/g, '')) || 1 : 1),
              task: item.milestone ? `${item.milestone}: ${item.task || ''}` : (item.task || ''),
              duration: item.minutes ? (typeof item.minutes === 'string' ? parseInt(item.minutes) || parsedGoal.dailyTime : item.minutes) : parsedGoal.dailyTime
            })),
          pros: ['Clear targets', 'Regular achievements', 'Motivation boost'],
          bestFor: 'Goal-oriented achievers',
        });
      }
      // Time Blocked strategy is handled on frontend with more detailed planning
      strategies.push({
        id: 'time-blocked',
        name: 'Time Blocked',
        icon: Clock,
        description: 'Dedicate fixed time blocks daily with focused sessions',
        plan: Array.from({ length: parsedGoal.timeframe }, (_, i) => {
          const day = i + 1;
          const isWeekend = day % 7 === 0 || day % 7 === 6;
          const weekNumber = Math.ceil(day / 7);
          
          let taskDescription;
          if (parsedGoal.title.toLowerCase().includes('python') || parsedGoal.title.toLowerCase().includes('coding')) {
            if (day <= 5) taskDescription = `Foundation: Setup environment, basics, syntax`;
            else if (day <= 10) taskDescription = `Core concepts: Data structures, functions, OOP`;
            else taskDescription = `Advanced: Projects, debugging, best practices`;
          } else if (parsedGoal.title.toLowerCase().includes('dsa')) {
            if (day <= 5) taskDescription = `Arrays & Strings: Theory + 3-5 problems`;
            else if (day <= 10) taskDescription = `Trees & Graphs: Implementation + practice`;
            else taskDescription = `Dynamic Programming: Complex problems`;
          } else {
            taskDescription = `Week ${weekNumber} focus: ${parsedGoal.title}`;
          }
          
          return {
            day,
            task: `${isWeekend ? 'Weekend' : 'Weekday'} session: ${taskDescription}`,
            duration: isWeekend ? Math.floor(parsedGoal.dailyTime * 0.7) : parsedGoal.dailyTime,
          };
        }),
        pros: ['Habit building', 'Consistent schedule', 'Deep focus'],
        bestFor: 'People with regular schedules',
      });
      setAnalysis({ parsedGoal, strategies });
      setViewingStrategy(null);
      setEditablePlan([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze goal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlan = async () => {
    if (!goalInput.trim()) {
      setError('Please enter your goal.');
      return;
    }
    await analyzeGoal(goalInput.trim());
  };

  const handleStrategySelect = (strategy: PlanningStrategy) => {
    if (analysis) {
      onStrategySelected(strategy, analysis);
      onClose();
    }
  };

  const handleViewPlan = (strategy: PlanningStrategy) => {
    setViewingStrategy(strategy);
    setEditablePlan([...strategy.plan]);
  };

  const handleBackToStrategies = () => {
    setViewingStrategy(null);
    setEditablePlan([]);
  };

  const handleTaskEdit = (index: number, newTask: string) => {
    const updatedPlan = [...editablePlan];
    updatedPlan[index] = { ...updatedPlan[index], task: newTask };
    setEditablePlan(updatedPlan);
  };

  const handleTaskDurationEdit = (index: number, newDuration: number) => {
    const updatedPlan = [...editablePlan];
    updatedPlan[index] = { ...updatedPlan[index], duration: newDuration };
    setEditablePlan(updatedPlan);
  };

  const handleUseEditedPlan = () => {
    if (viewingStrategy && analysis) {
      const updatedStrategy = { ...viewingStrategy, plan: editablePlan };
      onStrategySelected(updatedStrategy, analysis);
      onClose();
    }
  };

  const handleClose = () => {
    setGoalInput('');
    setAnalysis(null);
    setError('');
    setViewingStrategy(null);
    setEditablePlan([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-white/20 dark:border-gray-700/50">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 px-6 py-5 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                AI Goal Planner
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-base font-semibold text-gray-900 dark:text-white mb-3">
                Describe your goal naturally
              </label>
              <textarea
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder={`Try examples like:
• "Learn Python in 20 days, 2 hrs/day"
• "Finish 10 DSA topics in 15 days"
• "Lose 3kg in 30 days with 45min daily walks"
• "Finish college project in 10 days, 3hr per day"
• "Finish 4 books in 30 days, 1hr/day"`}
                rows={5}
                className="w-full px-5 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/90 dark:bg-gray-700/90 dark:text-white resize-none text-base backdrop-blur-sm transition-all duration-200"
              />
            </div>

            {/* Examples */}
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 flex items-center">
                <Target className="w-4 h-4 mr-1" />
                Quick examples:
              </p>
              <div className="flex flex-wrap gap-3">
                {examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setGoalInput(example)}
                    className="text-sm px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-medium border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="flex justify-center">
              <Button
                onClick={handlePlan}
                loading={loading}
                disabled={!goalInput.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-4 text-lg font-bold shadow-xl"
                size="lg"
              >
                <Brain className="w-5 h-5 mr-2" />
                {loading ? 'Analyzing Goal...' : 'Analyze Goal'}
              </Button>
            </div>
          </div>

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-8">
              {/* Goal Analysis Summary */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-2 border-blue-200 dark:border-blue-700/50 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                  Goal Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Title</span>
                    <p className="font-bold text-lg text-gray-900 dark:text-white mt-1">{analysis.parsedGoal.title}</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Duration</span>
                    <p className="font-bold text-lg text-gray-900 dark:text-white mt-1">{analysis.parsedGoal.timeframe} days</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Daily Time</span>
                    <p className="font-bold text-lg text-gray-900 dark:text-white mt-1">
                      {Math.floor(analysis.parsedGoal.dailyTime / 60)}h {analysis.parsedGoal.dailyTime % 60}m
                    </p>
                  </div>
                </div>
              </Card>

              {/* Planning Strategies */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  🎯 Choose Your Planning Strategy
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {analysis.strategies.map((strategy) => (
                    <Card 
                      key={strategy.id}
                      className="hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-600 transform hover:scale-105"
                      variant="glass"
                    >
                      <div className="space-y-5">
                        {/* Strategy Header */}
                        <div className="flex items-start space-x-3">
                          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex-shrink-0 shadow-lg">
                            <strategy.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-xl text-gray-900 dark:text-white">{strategy.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">{strategy.description}</p>
                          </div>
                        </div>

                        {/* Advantages */}
                        <div>
                          <h5 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center uppercase tracking-wide">
                            ✅ Advantages:
                          </h5>
                          <ul className="space-y-2">
                            {strategy.pros.map((pro, index) => (
                              <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-center font-medium">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Best For */}
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700/50 dark:to-blue-900/20 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                            <strong className="text-blue-700 dark:text-blue-400">Best for:</strong> {strategy.bestFor}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 pt-2">
                          <Button
                            onClick={() => handleViewPlan(strategy)}
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 py-3 font-semibold"
                          >
                            <Target className="w-4 h-4 mr-2" />
                            View Plan
                          </Button>
                          <Button
                            onClick={() => handleStrategySelect(strategy)}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-3 font-semibold"
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Use This Strategy
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Detailed Plan Viewer */}
          {viewingStrategy && analysis && (
            <div className="space-y-8">
              {/* Header with Back Button */}
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-700/50">
                <Button
                  onClick={handleBackToStrategies}
                  className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 px-4 py-2"
                >
                  <span>←</span>
                  <span>Back to Strategies</span>
                </Button>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    <viewingStrategy.icon className="w-6 h-6 mr-2 text-purple-500" />
                    {viewingStrategy.name} - Detailed Plan
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
                    Goal: {analysis.parsedGoal.title} | {analysis.parsedGoal.timeframe} days | {Math.floor(analysis.parsedGoal.dailyTime / 60)}h {analysis.parsedGoal.dailyTime % 60}m daily
                  </p>
                </div>
              </div>

              {/* Plan Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Scrollable Plan List */}
                <div className="lg:col-span-2">
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white flex items-center">
                        📋 Daily Tasks (Editable)
                      </h4>
                    </div>
                    <div className="max-h-96 overflow-y-auto p-5 space-y-4">
                      {editablePlan.map((task, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-600">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-gray-700 dark:text-gray-300 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-lg">
                              Day {task.day}
                            </span>
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                value={Math.floor(task.duration / 60)}
                                onChange={(e) => handleTaskDurationEdit(index, parseInt(e.target.value) * 60)}
                                className="w-16 px-2 py-1 text-xs border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold"
                                min="0"
                                title={`Duration for day ${task.day}`}
                                placeholder="Hours"
                              />
                              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">hours</span>
                            </div>
                          </div>
                          <textarea
                            value={task.task}
                            onChange={(e) => handleTaskEdit(index, e.target.value)}
                            className="w-full px-4 py-3 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none font-medium"
                            rows={2}
                            title={`Task for day ${task.day}`}
                            placeholder="Enter task description..."
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Strategy Info Sidebar */}
                <div className="space-y-6">
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5">
                    <h5 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Strategy Benefits</h5>
                    <ul className="space-y-3">
                      {viewingStrategy.pros.map((pro, index) => (
                        <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-center font-medium">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-5">
                    <h5 className="font-bold text-blue-900 dark:text-blue-300 mb-3 text-lg">Best For</h5>
                    <p className="text-sm text-blue-800 dark:text-blue-400 font-medium">
                      {viewingStrategy.bestFor}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handleUseEditedPlan}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 py-3 font-bold"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Use This Plan
                    </Button>
                    <Button
                      onClick={handleBackToStrategies}
                      className="w-full bg-gray-500 hover:bg-gray-600 py-3 font-semibold"
                    >
                      Choose Different Strategy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};