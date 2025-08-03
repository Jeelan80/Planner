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
  category: string;
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

  const examples = [
    "Learn Python in 20 days, 2 hrs/day",
    "Finish 10 DSA topics in 15 days",
    "Lose 3kg in 30 days with 45min daily walks",
    "Finish college project in 10 days, 3hr per day",
    "Finish 4 books in 30 days, 1hr/day",
  ];

  // Mock AI analysis function
  const analyzeGoal = async (input: string) => {
    setLoading(true);
    setError('');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    try {
      // Simple pattern matching
      const timeframeMatch = input.match(/(\d+)\s*(days?|weeks?|months?|hours?)/i);
      const dailyTimeMatch = input.match(/(\d+)\s*(hrs?|hours?|min|minutes?)/i);
      const urgentMatch = input.match(/(urgent|today|tomorrow|hour|asap)/i);

      const timeframe = timeframeMatch ? parseInt(timeframeMatch[1]) : 30;
      const dailyTime = dailyTimeMatch ? parseInt(dailyTimeMatch[1]) : 2;
      const isUrgent = !!urgentMatch;

      let category = 'skill';
      if (input.match(/(learn|study|python|javascript|coding|dsa|algorithm)/i)) category = 'learning';
      if (input.match(/(lose|weight|kg|fitness|walk|exercise|gym)/i)) category = 'fitness';
      if (input.match(/(project|assignment|college|work|complete)/i)) category = 'project';
      if (input.match(/(speech|presentation|interview)/i)) category = 'urgent';
      if (input.match(/(habit|daily|routine)/i)) category = 'habit';

      const parsedGoal = {
        title: input.replace(/in \d+.*$/i, '').trim(),
        timeframe: isUrgent ? 1 : timeframe,
        dailyTime: dailyTime * 60,
        category,
      };

      // Generate strategies
      const strategies: PlanningStrategy[] = [];

      strategies.push({
        id: 'step-by-step',
        name: 'Step-by-Step',
        icon: Target,
        description: 'Break your goal into fixed steps, spread evenly over time',
        plan: Array.from({ length: parsedGoal.timeframe }, (_, i) => ({
          day: i + 1,
          task: `Day ${i + 1}: Focus on ${parsedGoal.title} - ${Math.floor(parsedGoal.dailyTime / 60)}h ${parsedGoal.dailyTime % 60}m`,
          duration: parsedGoal.dailyTime,
        })),
        pros: ['Clear daily tasks', 'Easy to follow', 'Consistent progress'],
        bestFor: 'Beginners and structured learners',
      });

      strategies.push({
        id: 'time-blocked',
        name: 'Time Blocked',
        icon: Clock,
        description: 'Dedicate fixed time blocks daily with focused sessions',
        plan: Array.from({ length: parsedGoal.timeframe }, (_, i) => ({
          day: i + 1,
          task: `${(i + 1) % 7 === 0 || (i + 1) % 7 === 6 ? 'Weekend' : 'Weekday'} session: ${parsedGoal.title}`,
          duration: ((i + 1) % 7 === 0 || (i + 1) % 7 === 6) ? Math.floor(parsedGoal.dailyTime * 0.7) : parsedGoal.dailyTime,
        })),
        pros: ['Habit building', 'Consistent schedule', 'Deep focus'],
        bestFor: 'People with regular schedules',
      });

      strategies.push({
        id: 'progressive',
        name: 'Progressive Load',
        icon: TrendingUp,
        description: 'Start light, gradually increase intensity over time',
        plan: Array.from({ length: parsedGoal.timeframe }, (_, i) => {
          const progress = (i + 1) / parsedGoal.timeframe;
          const currentMinutes = Math.floor(parsedGoal.dailyTime * 0.5 + (parsedGoal.dailyTime * 0.5 * progress));
          return {
            day: i + 1,
            task: `Progressive session ${i + 1}: ${parsedGoal.title}`,
            duration: currentMinutes,
          };
        }),
        pros: ['Builds momentum', 'Prevents burnout', 'Sustainable'],
        bestFor: 'Long-term goals and habit formation',
      });

      if (timeframe > 7) {
        strategies.push({
          id: 'milestone',
          name: 'Milestone-Oriented',
          icon: Zap,
          description: 'Set major checkpoints with mini-deadlines',
          plan: Array.from({ length: parsedGoal.timeframe }, (_, i) => ({
            day: i + 1,
            task: (i + 1) % 5 === 0 ? `Milestone ${Math.ceil((i + 1) / 5)}: Review and assess progress` : `Work towards Milestone ${Math.ceil((i + 1) / 5)}: ${parsedGoal.title}`,
            duration: parsedGoal.dailyTime,
          })),
          pros: ['Clear targets', 'Regular achievements', 'Motivation boost'],
          bestFor: 'Goal-oriented achievers',
        });
      }

      setAnalysis({ parsedGoal, strategies });
    } catch (err) {
      setError('Failed to analyze goal. Please try again.');
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

  const handleClose = () => {
    setGoalInput('');
    setAnalysis(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                AI Goal Planner
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
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
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white resize-none"
              />
            </div>

            {/* Examples */}
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                <Target className="w-4 h-4 mr-1" />
                Quick examples:
              </p>
              <div className="flex flex-wrap gap-2">
                {examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setGoalInput(example)}
                    className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            )}

            <div className="flex justify-center">
              <Button
                onClick={handlePlan}
                loading={loading}
                disabled={!goalInput.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                size="lg"
              >
                <Brain className="w-5 h-5 mr-2" />
                {loading ? 'Analyzing Goal...' : 'Analyze Goal'}
              </Button>
            </div>
          </div>

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-6">
              {/* Goal Analysis Summary */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                  Goal Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Title</span>
                    <p className="font-semibold text-gray-900 dark:text-white">{analysis.parsedGoal.title}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Duration</span>
                    <p className="font-semibold text-gray-900 dark:text-white">{analysis.parsedGoal.timeframe} days</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Daily Time</span>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {Math.floor(analysis.parsedGoal.dailyTime / 60)}h {analysis.parsedGoal.dailyTime % 60}m
                    </p>
                  </div>
                </div>
              </Card>

              {/* Planning Strategies */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  🎯 Choose Your Planning Strategy
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {analysis.strategies.map((strategy) => (
                    <Card 
                      key={strategy.id}
                      className="hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-700"
                    >
                      <div className="space-y-4">
                        {/* Strategy Header */}
                        <div className="flex items-start space-x-3">
                          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex-shrink-0">
                            <strategy.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-lg text-gray-900 dark:text-white">{strategy.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{strategy.description}</p>
                          </div>
                        </div>

                        {/* Advantages */}
                        <div>
                          <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                            ✅ Advantages:
                          </h5>
                          <ul className="space-y-1">
                            {strategy.pros.map((pro, index) => (
                              <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Best For */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Best for:</strong> {strategy.bestFor}
                          </p>
                        </div>

                        {/* Action Button */}
                        <Button
                          onClick={() => handleStrategySelect(strategy)}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Use This Strategy
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};