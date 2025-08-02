// Component for displaying individual tasks

import React from 'react';
import { Task } from '../../types';
import { Check, Clock, Calendar } from 'lucide-react';
import { dateUtils } from '../../utils/dateUtils';

interface TaskItemProps {
  task: Task;
  onToggleComplete?: (taskId: string, completed: boolean) => void;
  showGoalTitle?: boolean;
  goalTitle?: string;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  showGoalTitle = false,
  goalTitle,
}) => {
  const isOverdue = dateUtils.isPast(task.scheduledDate) && !task.completed;
  const isToday = dateUtils.isToday(task.scheduledDate);

  const getCategoryColor = (category: Task['category']) => {
    switch (category) {
      case 'daily': return 'bg-blue-200 text-blue-800 border-blue-300 shadow-sm font-semibold';
      case 'milestone': return 'bg-purple-200 text-purple-800 border-purple-300 shadow-sm font-semibold';
      case 'review': return 'bg-emerald-200 text-emerald-800 border-emerald-300 shadow-sm font-semibold';
      default: return 'bg-slate-200 text-slate-800 border-slate-300 shadow-sm font-semibold';
    }
  };

  return (
    <div className={`
      task-item-enhanced border rounded-xl p-5 transition-all duration-300
      ${task.completed ? 'opacity-80 bg-slate-100 border-slate-300' : 'bg-white border-slate-200'}
      ${isOverdue ? 'border-red-300 bg-red-50 shadow-red-100' : ''}
      ${isToday && !task.completed ? 'border-blue-400 shadow-blue-100 bg-blue-50' : ''}
      hover:shadow-lg hover:scale-[1.02]
    `}>
      <div className="flex items-start space-x-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggleComplete?.(task.id, !task.completed)}
          className={`
            flex items-center justify-center w-6 h-6 mt-0.5 rounded-lg border-2 transition-all duration-200 shadow-sm
            ${task.completed 
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-200' 
              : 'border-slate-400 hover:border-blue-500 hover:bg-blue-50 bg-white'
            }
          `}
        >
          {task.completed && <Check className="w-4 h-4" />}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Category */}
          <div className="flex items-center justify-between mb-3">
            <h4 className={`
              font-bold text-lg
              ${task.completed ? 'line-through text-slate-500' : 'text-slate-900'}
            `}>
              {task.title}
            </h4>
            
            <span className={`
              inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg border
              ${getCategoryColor(task.category)}
            `}>
              {task.category}
            </span>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-slate-700 mb-3 line-clamp-2 font-medium">
              {task.description}
            </p>
          )}

          {/* Goal Title (if showing) */}
          {showGoalTitle && goalTitle && (
            <p className="text-xs text-slate-600 mb-3 font-semibold bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
              Goal: {goalTitle}
            </p>
          )}

          {/* Task Details */}
          <div className="flex items-center space-x-4 text-xs text-slate-700 font-medium">
            {/* Scheduled Date */}
            <div className="flex items-center space-x-1 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
              <Calendar className="w-3 h-3 text-slate-600" />
              <span className={isOverdue ? 'text-red-700 font-bold' : 'text-slate-800'}>
                {dateUtils.formatDate(task.scheduledDate, 'relative')}
              </span>
            </div>

            {/* Estimated Time */}
            <div className="flex items-center space-x-1 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
              <Clock className="w-3 h-3 text-slate-600" />
              <span className="text-slate-800">
                {Math.floor(task.estimatedTimeMinutes / 60)}h {task.estimatedTimeMinutes % 60}m
              </span>
            </div>

            {/* Completion Status */}
            {task.completed && task.completedAt && (
              <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-1 rounded-md border border-emerald-200">
                Completed {dateUtils.formatDate(task.completedAt, 'relative')}
              </span>
            )}

            {/* Overdue indicator */}
            {isOverdue && (
              <span className="text-red-700 font-bold bg-red-100 px-2 py-1 rounded-md border border-red-200">
                Overdue
              </span>
            )}

            {/* Today indicator */}
            {isToday && !task.completed && (
              <span className="text-blue-700 font-bold bg-blue-100 px-2 py-1 rounded-md border border-blue-200">
                Due Today
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};