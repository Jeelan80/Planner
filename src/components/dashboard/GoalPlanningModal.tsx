// Goal Planning Modal component for the dashboard

import React, { useState, useCallback, memo, useRef } from 'react';

import { Button } from '../common/Button';
import styles from './GoalPlanningModal.module.css';
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

export const GoalPlanningModal: React.FC<GoalPlanningModalProps> = memo(({
  isOpen,
  onClose,
  onStrategySelected,
}) => {
  const [goalInput, setGoalInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [analysis, setAnalysis] = useState<GoalAnalysis | null>(null);
  const [error, setError] = useState('');
  const [viewingStrategy, setViewingStrategy] = useState<PlanningStrategy | null>(null);
  const [editablePlan, setEditablePlan] = useState<DailyTask[]>([]);
  const planViewRef = useRef<HTMLDivElement>(null);
  const analysisRef = useRef<HTMLDivElement>(null);

  const examples = [
    "Learn Python in 20 days, 2 hrs/day",
    "Finish 10 DSA topics in 15 days",
    "Lose 3kg in 30 days with 45min daily walks",
    "Finish college project in 10 days, 3hr per day",
    "Finish 4 books in 30 days, 1hr/day",
  ];

  const loadingSteps = [
    "🧠 Understanding your goal...",
    "📊 Analyzing timeframe and complexity...",
    "🎯 Generating personalized strategies...",
    "✨ Finalizing your plan..."
  ];

  // Real API call to backend
  const analyzeGoal = useCallback(async (input: string) => {
    setLoading(true);
    setError('');
    setLoadingStep(0);

    // Simulate progress steps
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 800);

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
          plan: (data.strategies.stepByStep as Array<{ day?: number; week?: number; task?: string; focus?: string; minutes?: string | number }>).
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
          plan: (data.strategies.progressiveLoad as Array<{ day?: number; week?: number; focus?: string; task?: string; minutes?: string | number }>).
            map(item => ({
              day: item.day || item.week || 1,
              task: item.task || item.focus || '',
              duration: item.minutes ? (typeof item.minutes === 'string' ? parseInt(item.minutes) || parsedGoal.dailyTime : item.minutes) : parsedGoal.dailyTime
            })),
          pros: ['Builds momentum', 'Prevents burnout', 'Sustainable'],
          bestFor: 'Long-term goals and habit formation',
        });
      }
      // Create milestone strategy directly on frontend - no backend dependency
      const createMilestoneStrategy = (goal: ParsedGoal) => {
        const milestones = [];
        const chunkSize = Math.max(3, Math.floor(goal.timeframe / 4)); // Create 3-4 milestones

        for (let i = 0; i < Math.ceil(goal.timeframe / chunkSize); i++) {
          const startDay = i * chunkSize + 1;
          const endDay = Math.min((i + 1) * chunkSize, goal.timeframe);

          // Generate milestone content based on goal type
          let milestoneTitle, taskDescription;

          if (goal.title.toLowerCase().includes('python') || goal.title.toLowerCase().includes('coding')) {
            const pythonMilestones = [
              { title: 'Foundation Setup', task: 'Install Python, VS Code, setup environment' },
              { title: 'Core Concepts', task: 'Variables, data types, functions, control flow' },
              { title: 'Advanced Topics', task: 'OOP, modules, file handling, error handling' },
              { title: 'Project & Practice', task: 'Build projects, debugging, best practices' }
            ];
            const milestone = pythonMilestones[i] || pythonMilestones[pythonMilestones.length - 1];
            milestoneTitle = milestone.title;
            taskDescription = milestone.task;
          } else if (goal.title.toLowerCase().includes('dsa')) {
            const dsaMilestones = [
              { title: 'Arrays & Strings', task: 'Master basic data structures and string manipulation' },
              { title: 'Trees & Graphs', task: 'Learn tree traversals and graph algorithms' },
              { title: 'Dynamic Programming', task: 'Solve DP problems and optimization techniques' },
              { title: 'Advanced Algorithms', task: 'Complex algorithms and problem-solving patterns' }
            ];
            const milestone = dsaMilestones[i] || dsaMilestones[dsaMilestones.length - 1];
            milestoneTitle = milestone.title;
            taskDescription = milestone.task;
          } else if (goal.title.toLowerCase().includes('fitness') || goal.title.toLowerCase().includes('weight')) {
            const fitnessMilestones = [
              { title: 'Foundation Phase', task: 'Establish routine, basic exercises, diet planning' },
              { title: 'Building Phase', task: 'Increase intensity, track progress, consistency' },
              { title: 'Strength Phase', task: 'Advanced workouts, muscle building, endurance' },
              { title: 'Maintenance Phase', task: 'Sustain results, fine-tune routine, long-term habits' }
            ];
            const milestone = fitnessMilestones[i] || fitnessMilestones[fitnessMilestones.length - 1];
            milestoneTitle = milestone.title;
            taskDescription = milestone.task;
          } else {
            // Generic milestones for any goal
            milestoneTitle = `Milestone ${i + 1}`;
            taskDescription = `Complete key objectives for ${goal.title}`;
          }

          milestones.push({
            day: endDay,
            task: `${milestoneTitle} (Days ${startDay}-${endDay}): ${taskDescription}`,
            duration: goal.dailyTime
          });
        }

        return milestones;
      };

      strategies.push({
        id: 'milestone',
        name: 'Milestone-Oriented',
        icon: Zap,
        description: 'Set major checkpoints with mini-deadlines',
        plan: createMilestoneStrategy(parsedGoal),
        pros: ['Clear targets', 'Regular achievements', 'Motivation boost'],
        bestFor: 'Goal-oriented achievers',
      });
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

      // Scroll to analysis section after a short delay to ensure DOM is updated
      setTimeout(() => {
        analysisRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze goal. Please try again.');
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
      setLoadingStep(0);
    }
  }, [loadingSteps.length]);

  const handlePlan = useCallback(async () => {
    if (!goalInput.trim()) {
      setError('Please enter your goal.');
      return;
    }
    await analyzeGoal(goalInput.trim());
  }, [goalInput, analyzeGoal]);

  const handleStrategySelect = useCallback((strategy: PlanningStrategy) => {
    if (analysis) {
      onStrategySelected(strategy, analysis);
      onClose();
    }
  }, [analysis, onStrategySelected, onClose]);

  const handleViewPlan = useCallback((strategy: PlanningStrategy) => {
    setViewingStrategy(strategy);
    setEditablePlan([...strategy.plan]);

    // Scroll to plan view after a short delay to ensure DOM is updated
    setTimeout(() => {
      planViewRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }, []);

  const handleBackToStrategies = useCallback(() => {
    setViewingStrategy(null);
    setEditablePlan([]);
  }, []);

  const handleTaskEdit = useCallback((index: number, newTask: string) => {
    setEditablePlan(prev => {
      const updatedPlan = [...prev];
      updatedPlan[index] = { ...updatedPlan[index], task: newTask };
      return updatedPlan;
    });
  }, []);

  const handleTaskDurationChange = useCallback((index: number, value: string, unit: 'h' | 'm') => {
    setEditablePlan(prev => {
      const updatedPlan = [...prev];
      const currentTask = updatedPlan[index];
      const hours = unit === 'h' ? parseInt(value, 10) || 0 : Math.floor(currentTask.duration / 60);
      const minutes = unit === 'm' ? parseInt(value, 10) || 0 : currentTask.duration % 60;
      updatedPlan[index] = { ...currentTask, duration: hours * 60 + minutes };
      return updatedPlan;
    });
  }, []);

  const handleUseEditedPlan = useCallback(() => {
    if (viewingStrategy && analysis) {
      const updatedStrategy = { ...viewingStrategy, plan: editablePlan };
      handleStrategySelect(updatedStrategy);
    }
  }, [viewingStrategy, analysis, editablePlan, handleStrategySelect]);


  const handleClose = useCallback(() => {
    setGoalInput('');
    setAnalysis(null);
    setError('');
    setViewingStrategy(null);
    setEditablePlan([]);
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 pt-20">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-5xl w-full max-h-[90vh] border border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header - Fixed at top */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-5 rounded-t-xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-xl">
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
              className="p-2 bg-red-50 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-gray-600 rounded-lg text-red-600 dark:text-gray-100 hover:text-red-700 dark:hover:text-white border-2 border-red-200 dark:border-gray-500 hover:border-red-300 dark:hover:border-gray-400 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <X className="w-5 h-5 stroke-2" />
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
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
                  className="w-full px-5 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 dark:text-white resize-none text-base"
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
                      className="text-sm px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 font-medium border border-gray-200 dark:border-gray-600"
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
                  className="bg-purple-500 hover:bg-purple-600 px-8 py-4 text-lg font-bold"
                  size="lg"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  {loading ? 'Analyzing Goal...' : 'Analyze Goal'}
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="space-y-6">
                {/* Compact Progress Steps */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      {loadingSteps[loadingStep]}
                    </span>
                  </div>
                  <div className="mt-3 bg-blue-200 dark:bg-blue-800 rounded-full h-1.5">
                    <div 
                      className={`${styles.progressBar} progress-${Math.round((loadingStep + 1) / loadingSteps.length * 4) * 25}`}
                    ></div>
                  </div>
                </div>

                {/* Skeleton Strategy Cards */}
                <div>
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                    <div className="w-48 h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 animate-pulse">
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex items-start space-x-3">
                            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
                            <div className="flex-1 space-y-2">
                              <div className="w-32 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
                              <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                              <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                          </div>

                          {/* Advantages */}
                          <div className="space-y-2">
                            <div className="w-24 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                            {[1, 2, 3].map((j) => (
                              <div key={j} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                                <div className="w-40 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                              </div>
                            ))}
                          </div>

                          {/* Best For */}
                          <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4">
                            <div className="w-full h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                          </div>

                          {/* Buttons */}
                          <div className="space-y-3">
                            <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Analysis Results */}
            {analysis && (
              <div ref={analysisRef} className="space-y-8">
                {/* Goal Analysis Summary */}
                <div className="bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700/50 rounded-xl p-6">
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
                </div>

                {/* Planning Strategies */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    🎯 Choose Your Planning Strategy
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {analysis.strategies.map((strategy) => (
                      <div
                        key={strategy.id}
                        className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 rounded-xl p-6"
                      >
                        <div className="space-y-5">
                          {/* Strategy Header */}
                          <div className="flex items-start space-x-3">
                            <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl flex-shrink-0">
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
                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                              <strong className="text-blue-700 dark:text-blue-400">Best for:</strong> {strategy.bestFor}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-3 pt-2">
                            <Button
                              onClick={() => handleViewPlan(strategy)}
                              className="w-full bg-blue-500 hover:bg-blue-600 py-3 font-semibold"
                            >
                              <Target className="w-4 h-4 mr-2" />
                              View Plan
                            </Button>
                            <Button
                              onClick={() => onStrategySelected(strategy, analysis)}
                              className="w-full bg-purple-500 hover:bg-purple-600 py-3 font-semibold"
                            >
                              <Calendar className="w-4 h-4 mr-2" />
                              Create Goal with This Strategy
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Plan Viewer */}
            {viewingStrategy && analysis && (
              <div ref={planViewRef} className="space-y-8">
                {/* Header with Back Button */}
                <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700/50">
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
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white flex items-center">
                          📋 Daily Tasks (Editable)
                        </h4>
                      </div>
                      <div className="p-5 space-y-3">
                        {editablePlan.map((task, index) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-sm font-bold px-2 py-1 rounded ${viewingStrategy?.id === 'milestone'
                                ? 'text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900'
                                : 'text-gray-700 dark:text-gray-300 bg-blue-100 dark:bg-blue-900'
                                }`}>
                                {viewingStrategy?.id === 'milestone'
                                  ? (() => {
                                    // Calculate the day range for this milestone
                                    const prevTask = editablePlan[index - 1];
                                    const startDay = prevTask ? prevTask.day + 1 : 1;
                                    return `Day ${startDay}-${task.day}`;
                                  })()
                                  : `Day ${task.day}`
                                }
                              </span>
                              {viewingStrategy?.id !== 'milestone' && (
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="number"
                                    aria-label="Hours"
                                    value={Math.floor(task.duration / 60)}
                                    onChange={(e) => handleTaskDurationChange(index, e.target.value, 'h')}
                                    className="w-12 px-1 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    min="0"
                                  />
                                  <span className="text-xs text-gray-500 dark:text-gray-400">h</span>
                                  <input
                                    type="number"
                                    aria-label="Minutes"
                                    value={task.duration % 60}
                                    onChange={(e) => handleTaskDurationChange(index, e.target.value, 'm')}
                                    className="w-12 px-1 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    min="0"
                                    max="59"
                                  />
                                  <span className="text-xs text-gray-500 dark:text-gray-400">m</span>
                                </div>
                              )}
                            </div>
                            <textarea
                              value={task.task}
                              onChange={(e) => handleTaskEdit(index, e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                              rows={2}
                              placeholder="Enter task description..."
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Strategy Info Sidebar - Sticky */}
                  <div className="space-y-6 sticky top-0 self-start">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
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

                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-5">
                      <h5 className="font-bold text-blue-900 dark:text-blue-300 mb-3 text-lg">Best For</h5>
                      <p className="text-sm text-blue-800 dark:text-blue-400 font-medium">
                        {viewingStrategy.bestFor}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={handleUseEditedPlan}
                        className="w-full bg-green-500 hover:bg-green-600 py-3 font-bold"
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
    </div>
  );
});