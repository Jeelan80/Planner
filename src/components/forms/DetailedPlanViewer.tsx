// Component to display detailed daily plan from AI analysis

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Circle, 
  Edit, 
  Save, 
  X, 
  Target,
  Star,
  ArrowLeft
} from 'lucide-react';

interface DailyTask {
  day: number;
  task: string;
  duration: number;
  notes?: string;
  completed?: boolean;
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
  deadline?: string;
  category: 'learning' | 'fitness' | 'project' | 'skill' | 'habit' | 'urgent';
}

interface GoalAnalysis {
  parsedGoal: ParsedGoal;
  strategies: PlanningStrategy[];
}

interface DetailedPlanViewerProps {
  strategy: PlanningStrategy;
  analysis: GoalAnalysis;
  onSave: (finalPlan: { strategy: PlanningStrategy; analysis: GoalAnalysis; customTasks?: DailyTask[] }) => void;
  onBack: () => void;
}

export const DetailedPlanViewer: React.FC<DetailedPlanViewerProps> = ({
  strategy,
  analysis,
  onSave,
  onBack,
}) => {
  const [tasks, setTasks] = useState<DailyTask[]>(strategy.plan);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const progressBarRef = useRef<HTMLDivElement>(null);

  const completedTasks = tasks.filter(task => task.completed).length;
  const progressPercentage = Math.round((completedTasks / tasks.length) * 100);

  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${progressPercentage}%`;
    }
  }, [progressPercentage]);

  const handleEditTask = (taskIndex: number) => {
    setEditingTask(taskIndex);
    setEditValue(tasks[taskIndex].task);
  };

  const handleSaveEdit = (taskIndex: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], task: editValue };
    setTasks(updatedTasks);
    setEditingTask(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditValue('');
  };

  const handleToggleComplete = (taskIndex: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = { 
      ...updatedTasks[taskIndex], 
      completed: !updatedTasks[taskIndex].completed 
    };
    setTasks(updatedTasks);
  };

  const handleSavePlan = () => {
    onSave({
      strategy,
      analysis,
      customTasks: tasks,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg">
                <strategy.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {strategy.name} Plan
                </h2>
                <p className="text-gray-600">{analysis.parsedGoal.title}</p>
              </div>
            </div>
          </div>
          <Button
            onClick={handleSavePlan}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Plan
          </Button>
        </div>

        {/* Goal Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-600">Goal</span>
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
            <div>
              <span className="text-sm font-medium text-gray-600">Strategy</span>
              <p className="font-semibold text-gray-900">{strategy.name}</p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Progress Overview</h3>
            <span className="text-sm font-medium text-gray-600">
              {completedTasks}/{tasks.length} tasks ({Math.round(progressPercentage)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              ref={progressBarRef}
              className={`bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-300`}
            ></div>
          </div>
        </div>

        {/* Strategy Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2 flex items-center">
              <Star className="w-4 h-4 mr-2" />
              Advantages
            </h4>
            <ul className="space-y-1">
              {strategy.pros.map((pro, index) => (
                <li key={index} className="text-sm text-green-800 flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Best For
            </h4>
            <p className="text-sm text-blue-800">{strategy.bestFor}</p>
          </div>
        </div>
      </Card>

      {/* Daily Tasks */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Daily Task Schedule
        </h3>
        
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                task.completed
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => handleToggleComplete(index)}
                  className="mt-1 transition-colors"
                >
                  {task.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {editingTask === index ? (
                        <div className="space-y-2">
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                            rows={2}
                            placeholder="Edit task description..."
                            aria-label="Edit task description"
                          />
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleSaveEdit(index)}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <Save className="w-3 h-3 mr-1" />
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                            >
                              <X className="w-3 h-3 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h4 className={`font-medium ${task.completed ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                            Day {task.day}
                          </h4>
                          <p className={`text-sm mt-1 ${task.completed ? 'text-green-700 line-through' : 'text-gray-700'}`}>
                            {task.task}
                          </p>
                        </div>
                      )}
                    </div>

                    {editingTask !== index && (
                      <div className="flex items-center space-x-2 ml-4">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {Math.floor(task.duration / 60)}h {task.duration % 60}m
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditTask(index)}
                          className="p-1"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {task.notes && (
                    <div className="bg-blue-50 rounded-md p-2 border border-blue-200">
                      <p className="text-xs text-blue-800">
                        💡 {task.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Strategies
        </Button>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setTasks(strategy.plan)}
          >
            Reset to Original
          </Button>
          <Button
            onClick={handleSavePlan}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Save className="w-4 h-4 mr-2" />
            Save & Create Goal
          </Button>
        </div>
      </div>
    </div>
  );
};
