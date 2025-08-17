import React, { useState, useMemo, useEffect } from 'react';
import { CheckSquare, Edit3, Trash2, X, Plus, Calendar, Clock, Target, Check } from 'lucide-react';
import { DashboardCard } from '../../../types/dashboard';
import { Task } from '../../../types';
import { Button } from '../../common/Button';
import styles from './TaskSummaryCard.module.css';

interface TaskSummaryCardProps {
  card: DashboardCard;
  isCustomizing: boolean;
  onUpdate: (cardId: string, updates: Partial<DashboardCard>) => void;
  onDelete: (cardId: string) => void;
  getTodaysTasks: () => Task[];
  getOverdueTasks: () => Task[];
  tasks: Task[];
  onToggleTask: (taskId: string, completed: boolean) => void;
}

interface TaskConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (filter: 'today' | 'upcoming' | 'overdue', maxItems: number) => void;
  initialData?: {
    filter: 'today' | 'upcoming' | 'overdue';
    maxItems: number;
  };
}

const TaskConfigModal: React.FC<TaskConfigModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [filter, setFilter] = useState<'today' | 'upcoming' | 'overdue'>(initialData?.filter || 'today');
  const [maxItems, setMaxItems] = useState(initialData?.maxItems || 5);

  const handleSave = () => {
    onSave(filter, maxItems);
    onClose();
  };

  // Block body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {initialData ? 'Edit Task Summary' : 'Configure Task Summary'}
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
            {/* Filter Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Task Filter
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="filter"
                    value="today"
                    checked={filter === 'today'}
                    onChange={(e) => setFilter(e.target.value as 'today')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Today's Tasks
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="filter"
                    value="upcoming"
                    checked={filter === 'upcoming'}
                    onChange={(e) => setFilter(e.target.value as 'upcoming')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Upcoming Tasks (Next 7 days)
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="filter"
                    value="overdue"
                    checked={filter === 'overdue'}
                    onChange={(e) => setFilter(e.target.value as 'overdue')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Overdue Tasks
                  </span>
                </label>
              </div>
            </div>

            {/* Max Items */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maximum Items to Show
              </label>
              <select
                value={maxItems}
                onChange={(e) => setMaxItems(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Maximum number of tasks to display"
                title="Select maximum number of tasks to display"
              >
                <option value={3}>3 tasks</option>
                <option value={5}>5 tasks</option>
                <option value={8}>8 tasks</option>
                <option value={10}>10 tasks</option>
              </select>
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
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {initialData ? 'Update' : 'Add Task Summary'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TaskSummaryCard: React.FC<TaskSummaryCardProps> = ({
  card,
  isCustomizing,
  onUpdate,
  onDelete,
  getTodaysTasks,
  getOverdueTasks,
  tasks,
  onToggleTask,
}) => {
  const [showConfigModal, setShowConfigModal] = useState(false);

  const taskConfig = card.config.tasks;

  const handleSaveConfig = (filter: 'today' | 'upcoming' | 'overdue', maxItems: number) => {
    onUpdate(card.id, {
      config: {
        ...card.config,
        tasks: {
          filter,
          maxItems,
        },
      },
    });
  };

  // Get filtered tasks based on configuration
  const filteredTasks = useMemo(() => {
    if (!taskConfig) return [];

    let taskList: Task[] = [];

    switch (taskConfig.filter) {
      case 'today':
        taskList = getTodaysTasks();
        break;
      case 'overdue':
        taskList = getOverdueTasks();
        break;
      case 'upcoming': {
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        taskList = tasks.filter(task => {
          const taskDate = new Date(task.scheduledDate);
          return taskDate > today && taskDate <= nextWeek && !task.completed;
        });
        break;
      }
      default:
        taskList = [];
    }

    return taskList
      .sort((a, b) => {
        // Sort by completion status first (incomplete first), then by date
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
      })
      .slice(0, taskConfig.maxItems);
  }, [taskConfig, getTodaysTasks, getOverdueTasks, tasks]);

  const completedCount = filteredTasks.filter(task => task.completed).length;
  const totalCount = filteredTasks.length;

  // If no task config, show setup state
  if (!taskConfig) {
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
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg mx-auto mb-4">
              <CheckSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Task Summary</h3>
            <p className="text-white/70 text-sm mb-4">
              Overview of your tasks with quick completion toggle
            </p>
            <Button
              onClick={() => setShowConfigModal(true)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Configure Tasks
            </Button>
          </div>
        </div>

        <TaskConfigModal
          isOpen={showConfigModal}
          onClose={() => setShowConfigModal(false)}
          onSave={handleSaveConfig}
        />
      </>
    );
  }

  const getFilterTitle = () => {
    switch (taskConfig.filter) {
      case 'today':
        return "Today's Tasks";
      case 'upcoming':
        return 'Upcoming Tasks';
      case 'overdue':
        return 'Overdue Tasks';
      default:
        return 'Tasks';
    }
  };

  const getFilterIcon = () => {
    switch (taskConfig.filter) {
      case 'today':
        return Calendar;
      case 'upcoming':
        return Clock;
      case 'overdue':
        return Target;
      default:
        return CheckSquare;
    }
  };

  const FilterIcon = getFilterIcon();

  return (
    <>
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-200 group relative min-h-[320px] w-full flex flex-col">
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

        <div className="space-y-4 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FilterIcon className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-semibold text-white">
                {getFilterTitle()}
              </h3>
            </div>
            {totalCount > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-white/70">
                  {completedCount}/{totalCount}
                </span>
                <div className="w-8 h-2 bg-white/20 rounded-full">
                  <div
                    className={`h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full ${styles.progressBar}`}
                    style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }} // Dynamic width based on completion
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Task List */}
          <div className="space-y-2 flex-1 overflow-y-auto">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-6 flex-1 flex flex-col justify-center">
                <CheckSquare className="w-8 h-8 text-white/40 mx-auto mb-2" />
                <p className="text-white/60 text-sm">
                  {taskConfig.filter === 'today' && 'No tasks for today'}
                  {taskConfig.filter === 'upcoming' && 'No upcoming tasks'}
                  {taskConfig.filter === 'overdue' && 'No overdue tasks'}
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-start space-x-3 p-2 rounded-lg transition-all ${
                    task.completed 
                      ? 'bg-white/5 opacity-75' 
                      : 'bg-white/10 hover:bg-white/15'
                  }`}
                >
                  <button
                    onClick={() => onToggleTask(task.id, !task.completed)}
                    className={`mt-1 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                      task.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-white/40 hover:border-white/60'
                    }`}
                  >
                    {task.completed && <Check className="w-3 h-3 text-white" />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium line-clamp-2 ${
                      task.completed 
                        ? 'line-through text-white/60' 
                        : 'text-white'
                    }`}>
                      {task.title}
                    </p>
                    
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1 text-xs text-white/60">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(task.scheduledDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-xs text-white/60">
                        <Clock className="w-3 h-3" />
                        <span>{task.estimatedTimeMinutes}min</span>
                      </div>
                      
                      <span className={`inline-block px-1.5 py-0.5 text-xs rounded font-medium ${
                        task.category === 'milestone'
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {task.category === 'milestone' ? 'Milestone' : 'Daily'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Stats */}
          {totalCount > 0 && (
            <div className="pt-2 border-t border-white/20 mt-auto">
              <div className="flex justify-between items-center text-xs text-white/70">
                <span>
                  Showing {Math.min(filteredTasks.length, taskConfig.maxItems)}
                </span>
                <span>
                  {Math.round(totalCount > 0 ? (completedCount / totalCount) * 100 : 0)}% complete
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <TaskConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        onSave={handleSaveConfig}
        initialData={taskConfig}
      />
    </>
  );
};