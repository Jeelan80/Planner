// AI-powered goal planning component with natural language processing

import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Brain, Zap, Calendar, Target, TrendingUp, Clock, Sparkles } from 'lucide-react';

export interface ParsedGoal {
  title: string;
  timeframe: number;
  dailyTime: number;
  deadline?: string;
  category: 'learning' | 'fitness' | 'project' | 'skill' | 'habit' | 'urgent';
}

export interface GoalAnalysis {
  parsedGoal: ParsedGoal;
  strategies: PlanningStrategy[];
}

export interface PlanningStrategy {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  plan: DailyTask[];
  pros: string[];
  bestFor: string;
}

export interface DailyTask {
  day: number;
  task: string;
  duration: number;
  notes?: string;
}

interface AIGoalPlannerProps {
  onPlanSelected: (strategy: PlanningStrategy, analysis: GoalAnalysis) => void;
  onCancel?: () => void;
}

export const AIGoalPlanner: React.FC<AIGoalPlannerProps> = ({
  onPlanSelected,
  onCancel,
}) => {
  const [userInput, setUserInput] = useState('');
  const [analysis, setAnalysis] = useState<GoalAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

  // Mock AI analysis function (replace with actual AI API call)
  const analyzeGoal = async (input: string): Promise<GoalAnalysis> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Parse the goal using pattern matching (simplified)
    const timeframeMatch = input.match(/(\d+)\s*(days?|weeks?|months?|hours?)/i);
    const dailyTimeMatch = input.match(/(\d+)\s*(hrs?|hours?|min|minutes?)/i);
    const urgentMatch = input.match(/(urgent|today|tomorrow|hour|asap)/i);

    const timeframe = timeframeMatch ? parseInt(timeframeMatch[1]) : 30;
    const dailyTime = dailyTimeMatch ? parseInt(dailyTimeMatch[1]) : 2;
    const isUrgent = !!urgentMatch;

    // Determine category
    let category: GoalAnalysis['parsedGoal']['category'] = 'skill';
    if (input.match(/(learn|study|python|javascript|coding|dsa|algorithm)/i)) category = 'learning';
    if (input.match(/(lose|weight|kg|fitness|walk|exercise|gym)/i)) category = 'fitness';
    if (input.match(/(project|assignment|college|work|complete)/i)) category = 'project';
    if (input.match(/(speech|presentation|interview)/i)) category = 'urgent';
    if (input.match(/(habit|daily|routine)/i)) category = 'habit';

    const parsedGoal = {
      title: input.replace(/in \d+.*$/i, '').trim(),
      timeframe: isUrgent ? 1 : timeframe,
      dailyTime: dailyTime * 60, // Convert to minutes
      category,
    };

    // Generate different planning strategies
    const strategies: PlanningStrategy[] = [];

    // Strategy 1: Step-by-Step
    strategies.push({
      id: 'step-by-step',
      name: 'Step-by-Step',
      icon: Target,
      description: 'Break your goal into fixed steps, spread evenly over time',
      plan: generateStepByStepPlan(parsedGoal),
      pros: ['Clear daily tasks', 'Easy to follow', 'Consistent progress'],
      bestFor: 'Beginners and structured learners',
    });

    // Strategy 2: Time Blocked
    strategies.push({
      id: 'time-blocked',
      name: 'Time Blocked',
      icon: Clock,
      description: 'Dedicate fixed time blocks daily with focused sessions',
      plan: generateTimeBlockedPlan(parsedGoal),
      pros: ['Habit building', 'Consistent schedule', 'Deep focus'],
      bestFor: 'People with regular schedules',
    });

    // Strategy 3: Progressive Load
    strategies.push({
      id: 'progressive',
      name: 'Progressive Load',
      icon: TrendingUp,
      description: 'Start light, gradually increase intensity over time',
      plan: generateProgressivePlan(parsedGoal),
      pros: ['Builds momentum', 'Prevents burnout', 'Sustainable'],
      bestFor: 'Long-term goals and habit formation',
    });

    // Strategy 4: Milestone-Oriented
    if (timeframe > 7) {
      strategies.push({
        id: 'milestone',
        name: 'Milestone-Oriented',
        icon: Zap,
        description: 'Set major checkpoints with mini-deadlines',
        plan: generateMilestonePlan(parsedGoal),
        pros: ['Clear targets', 'Regular achievements', 'Motivation boost'],
        bestFor: 'Goal-oriented achievers',
      });
    }

    return { parsedGoal, strategies };
  };

  const generateStepByStepPlan = (goal: ParsedGoal): DailyTask[] => {
    const tasks: DailyTask[] = [];
    const dailyMinutes = goal.dailyTime;
    
    for (let day = 1; day <= goal.timeframe; day++) {
      tasks.push({
        day,
        task: `Day ${day}: Focus on ${goal.title} - ${Math.floor(dailyMinutes / 60)}h ${dailyMinutes % 60}m`,
        duration: dailyMinutes,
        notes: day % 7 === 0 ? 'Review and consolidate progress' : undefined,
      });
    }
    return tasks;
  };

  const generateTimeBlockedPlan = (goal: ParsedGoal): DailyTask[] => {
    const tasks: DailyTask[] = [];
    const dailyMinutes = goal.dailyTime;
    
    for (let day = 1; day <= goal.timeframe; day++) {
      const isWeekend = day % 7 === 0 || day % 7 === 6;
      tasks.push({
        day,
        task: `${isWeekend ? 'Weekend' : 'Weekday'} session: ${goal.title}`,
        duration: isWeekend ? Math.floor(dailyMinutes * 0.7) : dailyMinutes,
        notes: isWeekend ? 'Lighter session on weekend' : 'Full focused session',
      });
    }
    return tasks;
  };

  const generateProgressivePlan = (goal: ParsedGoal): DailyTask[] => {
    const tasks: DailyTask[] = [];
    const maxMinutes = goal.dailyTime;
    
    for (let day = 1; day <= goal.timeframe; day++) {
      const progress = day / goal.timeframe;
      const currentMinutes = Math.floor(maxMinutes * 0.5 + (maxMinutes * 0.5 * progress));
      
      tasks.push({
        day,
        task: `Progressive session ${day}: ${goal.title}`,
        duration: currentMinutes,
        notes: day <= 3 ? 'Building the habit' : day >= goal.timeframe - 3 ? 'Final sprint!' : undefined,
      });
    }
    return tasks;
  };

  const generateMilestonePlan = (goal: ParsedGoal): DailyTask[] => {
    const tasks: DailyTask[] = [];
    
    for (let day = 1; day <= goal.timeframe; day++) {
      const milestone = Math.ceil(day / 5);
      const isMilestoneDay = day % 5 === 0;
      
      tasks.push({
        day,
        task: isMilestoneDay 
          ? `Milestone ${milestone}: Review and assess progress`
          : `Work towards Milestone ${milestone}: ${goal.title}`,
        duration: goal.dailyTime,
        notes: isMilestoneDay ? 'Milestone checkpoint - evaluate and adjust' : undefined,
      });
    }
    return tasks;
  };

  const handleAnalyze = async () => {
    if (!userInput.trim()) return;
    
    setLoading(true);
    try {
      const result = await analyzeGoal(userInput);
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing goal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStrategy = (strategy: PlanningStrategy) => {
    if (!analysis) return;
    onPlanSelected(strategy, analysis);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">
            AI Goal Planner
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              <span className="text-gray-900">Describe your goal naturally</span>
            </label>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={`Try examples like:
• "Learn Python in 20 days, 2 hrs/day"
• "Finish 10 DSA topics in 15 days"
• "Lose 3kg in 30 days with 45min daily walks"
• "Finish college project in 10 days, 3hr per day"
• "I have to give a speech in one hour"`}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
            />
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              <Sparkles className="w-4 h-4 inline mr-1" />
              AI will analyze and suggest multiple planning strategies
            </p>
            <div className="flex space-x-3">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button
                onClick={handleAnalyze}
                loading={loading}
                disabled={!userInput.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Brain className="w-4 h-4 mr-2" />
                Analyze Goal
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Parsed Goal Summary */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Goal Analysis</h3>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Title</span>
                  <p className="font-semibold text-gray-900">{analysis.parsedGoal.title}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Duration</span>
                  <p className="font-semibold text-gray-900">{analysis.parsedGoal.timeframe} days</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Daily Time</span>
                  <p className="font-semibold text-gray-900">
                    {Math.floor(analysis.parsedGoal.dailyTime / 60)}h {analysis.parsedGoal.dailyTime % 60}m
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Planning Strategies */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Choose Your Planning Strategy</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analysis.strategies.map((strategy) => (
                <Card 
                  key={strategy.id} 
                  hover
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedStrategy === strategy.id 
                      ? 'ring-2 ring-purple-500 bg-purple-50' 
                      : 'hover:shadow-lg'
                  }`}
                >
                  <div 
                    className="space-y-4"
                    onClick={() => setSelectedStrategy(strategy.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg">
                        <strategy.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{strategy.name}</h4>
                        <p className="text-sm text-gray-600">{strategy.description}</p>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">✅ Advantages:</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {strategy.pros.map((pro, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">
                        <strong>Best for:</strong> {strategy.bestFor}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <Button
                        onClick={() => handleSelectStrategy(strategy)}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        size="sm"
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
    </div>
  );
};
