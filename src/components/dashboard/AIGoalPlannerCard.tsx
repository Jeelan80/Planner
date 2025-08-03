// AI Goal Planner card component for the dashboard

import React, { useState } from 'react';
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
    category: string;
  };
  strategies: PlanningStrategy[];
}
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Brain, Sparkles, Target, Clock, Zap } from 'lucide-react';

export const AIGoalPlannerCard: React.FC = () => {
  const examples = [
    "Learn Python in 20 days, 2 hrs/day",
    "Finish 10 DSA topics in 15 days",
    "Lose 3kg in 30 days with 45min daily walks",
    "Finish college project in 10 days, 3hr per day",
    "Finish 4 books in 30 days, 1hr/day",
  ];

  // Local state for input and planning
  const [goalInput, setGoalInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<GoalAnalysis | null>(null);
  const [error, setError] = useState<string>("");

  // Mock AI analysis (same as in AIGoalPlanner)
  const analyzeGoal = async (input: string) => {
    setLoading(true);
    setError("");
    await new Promise(resolve => setTimeout(resolve, 1200));
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
    // Strategies
    const strategies = [];
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
      icon: Sparkles,
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
    setLoading(false);
  };

  const handlePlan = async () => {
    if (!goalInput.trim()) {
      setError('Please enter your goal.');
      return;
    }
    await analyzeGoal(goalInput.trim());
  };

  return (
    <Card className="relative overflow-hidden mx-auto max-w-2xl min-h-[600px] flex flex-col justify-start items-center p-8 rounded-3xl shadow-2xl border-2 border-purple-300 card-gradient mt-20">
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
              <span>AI Goal Planner</span>
              <Sparkles className="w-6 h-6 text-purple-400 dark:text-purple-300" />
            </h3>
            <p className="text-base text-slate-300 dark:text-slate-200 font-medium mb-2">What's Your Goal?</p>
            <input
              type="text"
              value={goalInput}
              onChange={e => setGoalInput(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-purple-400 dark:border-purple-500 focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-400 text-base text-white dark:text-white bg-slate-800/60 dark:bg-slate-700/60 mb-2 shadow-sm placeholder-slate-400 dark:placeholder-slate-300"
              placeholder="Finish 4 books in 30 days, 1hr/day"
              disabled={loading}
            />
            <Button
              onClick={handlePlan}
              className="btn-gradient text-white font-semibold py-2 px-6 text-base shadow-lg hover:shadow-xl transition-all duration-300 w-full"
              icon={Brain}
              disabled={loading}
            >
              {loading ? 'Planning...' : 'Plan My Goal'}
            </Button>
            {error && <p className="text-red-500 dark:text-red-400 mt-2 text-sm">{error}</p>}
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
                onClick={() => setGoalInput(example)}
                aria-label={`Fill input with example: ${example}`}
              >
                <span className="text-slate-300 dark:text-slate-200 font-medium">"{example}"</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI features highlight */}
        <div className="bg-slate-800/60 dark:bg-slate-700/60 rounded-lg p-4 mb-6 border border-purple-400 dark:border-purple-500 max-w-md mx-auto w-full">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-semibold text-purple-300 dark:text-purple-200">AI will analyze and suggest multiple planning strategies</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-purple-400 dark:text-purple-300">
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

        {/* Show planning strategies if available */}
        {analysis && (
          <Card className="mt-8 mx-auto max-w-3xl p-6 rounded-2xl shadow-lg border border-purple-200 card-gradient w-full">
            <h4 className="text-xl font-bold text-purple-400 dark:text-purple-300 mb-4 text-center">Suggested Planning Strategies</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {analysis.strategies.map((strategy: PlanningStrategy) => (
                <div key={strategy.id} className="border border-purple-400 dark:border-purple-500 rounded-xl p-4 bg-slate-800/60 dark:bg-slate-700/60 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <strategy.icon className="w-5 h-5 text-purple-500" />
                      <span className="text-lg font-semibold text-purple-300 dark:text-purple-200">{strategy.name}</span>
                    </div>
                    <p className="text-slate-300 dark:text-slate-200 mb-2">{strategy.description}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {strategy.pros.map((pro: string, idx: number) => (
                        <span key={idx} className="bg-purple-900/50 dark:bg-purple-800/50 text-purple-300 dark:text-purple-200 px-2 py-1 rounded text-xs font-medium">{pro}</span>
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-300 mb-2">Best for: {strategy.bestFor}</span>
                  <details className="mt-3">
                    <summary className="cursor-pointer text-purple-400 dark:text-purple-300 font-semibold">View Daily Plan</summary>
                    <ul className="mt-2 space-y-1 text-sm">
                      {strategy.plan.map((task: DailyTask, idx: number) => (
                        <li key={idx} className="pl-2 text-slate-300 dark:text-slate-200">{task.task} <span className="text-slate-500 dark:text-slate-400">({Math.floor(task.duration / 60)}h {task.duration % 60}m)</span></li>
                      ))}
                    </ul>
                  </details>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </Card>
  );
};
