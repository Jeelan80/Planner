import React, { useState, useMemo } from 'react';
import { Target, Edit3, Trash2, X, Plus, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import { DashboardCard } from '../../../types/dashboard';
import { Goal } from '../../../types';
import { Button } from '../../common/Button';
import styles from './ProjectProgressCard.module.css';

interface ProjectProgressCardProps {
  card: DashboardCard;
  isCustomizing: boolean;
  onUpdate: (cardId: string, updates: Partial<DashboardCard>) => void;
  onDelete: (cardId: string) => void;
  onEdit: (cardId: string) => void;
  goals: Goal[];
  getTasksForGoal: (goalId: string) => Array<{id: string; completed: boolean; estimatedTimeMinutes: number}>;
}

interface ProgressConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goalId: string, showTasks: boolean, showPercentage: boolean) => void;
  goals: Goal[];
  initialData?: {
    goalId?: string;
    showTasks: boolean;
    showPercentage: boolean;
  };
}

const ProgressConfigModal: React.FC<ProgressConfigModalProps> = ({
  isOpen,
  onClose,
  onSave,
  goals,
  initialData,
}) => {
  const [selectedGoalId, setSelectedGoalId] = useState(initialData?.goalId || '');
  const [showTasks, setShowTasks] = useState(initialData?.showTasks ?? true);
  const [showPercentage, setShowPercentage] = useState(initialData?.showPercentage ?? true);

  const activeGoals = goals.filter(goal => goal.status === 'active');

  const handleSave = () => {
    if (!selectedGoalId) {
      alert('Please select a goal');
      return;
    }
    onSave(selectedGoalId, showTasks, showPercentage);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {initialData ? 'Edit Progress Card' : 'Configure Progress Card'}
            </h3>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="bg-transparent"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Goal Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Goal *
              </label>
              <select
                id="goal-selection"
                aria-label="Select Goal"
                title="Goal Selection"
                value={selectedGoalId}
                onChange={(e) => setSelectedGoalId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a goal...</option>
                {activeGoals.map(goal => (
                  <option key={goal.id} value={goal.id}>
                    {goal.title}
                  </option>
                ))}
              </select>
              {activeGoals.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  No active goals available. Create a goal first.
                </p>
              )}
            </div>

            {/* Display Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Display Options
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showTasks}
                    onChange={(e) => setShowTasks(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Show task count
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showPercentage}
                    onChange={(e) => setShowPercentage(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Show completion percentage
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 mt-6">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!selectedGoalId}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {initialData ? 'Update' : 'Add Progress Card'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProjectProgressCard: React.FC<ProjectProgressCardProps> = ({
  card,
  isCustomizing,
  onUpdate,
  onDelete,
  // onEdit is unused
  goals,
  getTasksForGoal,
}) => {
  const [showConfigModal, setShowConfigModal] = useState(false);

  const progressConfig = card.config.progress;

  const handleSaveConfig = (goalId: string, showTasks: boolean, showPercentage: boolean) => {
    onUpdate(card.id, {
      config: {
        ...card.config,
        progress: {
          goalId,
          showTasks,
          showPercentage,
        },
      },
    });
  };

  // Calculate progress data
  const progressData = useMemo(() => {
    if (!progressConfig?.goalId) return null;

    const goal = goals.find(g => g.id === progressConfig.goalId);
    if (!goal) return null;

    const tasks = getTasksForGoal(goal.id);
    const completedTasks = tasks.filter(task => task.completed);
    const totalTasks = tasks.length;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

    // Calculate days remaining
    const today = new Date();
    const endDate = new Date(goal.endDate);
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

    // Calculate total estimated time
    const totalEstimatedMinutes = tasks.reduce((sum, task) => sum + task.estimatedTimeMinutes, 0);
    const completedEstimatedMinutes = completedTasks.reduce((sum, task) => sum + task.estimatedTimeMinutes, 0);

    return {
      goal,
      tasks,
      completedTasks: completedTasks.length,
      totalTasks,
      completionPercentage,
      daysRemaining,
      totalEstimatedMinutes,
      completedEstimatedMinutes,
    };
  }, [progressConfig?.goalId, goals, getTasksForGoal]);

  // If no progress configured, show setup state
  if (!progressConfig?.goalId || !progressData) {
    return (
      <>
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-200 group relative h-[280px] w-full flex flex-col justify-center">
          {isCustomizing && (
            <div className="absolute top-2 right-2 flex space-x-1 opacity-100 transition-opacity">
              <Button
                onClick={() => onDelete(card.id)}
                variant="outline"
                size="sm"
                className="bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}

          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Progress Card</h3>
            <p className="text-white/70 text-sm mb-4">
              Track your goal progress and task completion
            </p>
            <Button
              onClick={() => setShowConfigModal(true)}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Configure Progress
            </Button>
          </div>
        </div>

        <ProgressConfigModal
          isOpen={showConfigModal}
          onClose={() => setShowConfigModal(false)}
          onSave={handleSaveConfig}
          goals={goals}
        />
      </>
    );
  }

  const { goal, completedTasks, totalTasks, completionPercentage, daysRemaining } = progressData;

  return (
    <>
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-200 group relative min-h-[320px] w-full flex flex-col">
        {isCustomizing && (
          <div className="absolute top-2 right-2 flex space-x-1 opacity-100 transition-opacity">
            <Button
              onClick={() => setShowConfigModal(true)}
              variant="outline"
              size="sm"
              className="bg-blue-500/20 border-blue-500/30 text-blue-300 hover:bg-blue-500/30"
            >
              <Edit3 className="w-3 h-3" />
            </Button>
            <Button
              onClick={() => onDelete(card.id)}
              variant="outline"
              size="sm"
              className="bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        )}

        <div className="space-y-4 flex-1">
          {/* Goal Title */}
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white truncate">
              {goal.title}
            </h3>
          </div>

          {/* Progress Bar */}
          {progressConfig.showPercentage && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-white/80">Progress</span>
                <span className="text-sm font-medium text-white">
                  {completionPercentage}%
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className={`${styles.progressBar}`}
                  style={{ width: `${completionPercentage}%` }} 
                  data-percentage={completionPercentage}
                ></div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {progressConfig.showTasks && (
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-white/70">Tasks</span>
                </div>
                <p className="text-lg font-bold text-white">
                  {completedTasks}/{totalTasks}
                </p>
              </div>
            )}

            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-white/70">Days Left</span>
              </div>
              <p className="text-lg font-bold text-white">
                {daysRemaining}
              </p>
            </div>
          </div>

          {/* Goal Priority Badge */}
          <div className="flex items-center justify-between mt-auto">
            <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
              goal.priority === 'high' 
                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                : goal.priority === 'medium'
                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                : 'bg-green-500/20 text-green-300 border border-green-500/30'
            }`}>
              {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} Priority
            </span>

            {completionPercentage > 0 && (
              <div className="flex items-center space-x-1 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium">On Track</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProgressConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        onSave={handleSaveConfig}
        goals={goals}
        initialData={progressConfig}
      />
    </>
  );
};