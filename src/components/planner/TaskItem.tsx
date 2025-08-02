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
      case 'daily': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'milestone': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'review': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className={`
      bg-white border rounded-lg p-4 transition-all duration-200
      ${task.completed ? 'opacity-75 bg-gray-50' : ''}
      ${isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200'}
      ${isToday && !task.completed ? 'border-blue-300 shadow-sm' : ''}
      hover:shadow-md
    `}>
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggleComplete?.(task.id, !task.completed)}
          className={`
            flex items-center justify-center w-5 h-5 mt-0.5 rounded border-2 transition-colors
            ${task.completed 
              ? 'bg-green-600 border-green-600 text-white' 
              : 'border-gray-300 hover:border-blue-500'
            }
          `}
        >
          {task.completed && <Check className="w-3 h-3" />}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Category */}
          <div className="flex items-center justify-between mb-2">
            <h4 className={`
              font-medium
              ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}
            `}>
              {task.title}
            </h4>
            
            <span className={`
              inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border
              ${getCategoryColor(task.category)}
            `}>
              {task.category}
            </span>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Goal Title (if showing) */}
          {showGoalTitle && goalTitle && (
            <p className="text-xs text-gray-500 mb-2">
              Goal: {goalTitle}
            </p>
          )}

          {/* Task Details */}
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            {/* Scheduled Date */}
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span className={isOverdue ? 'text-red-600' : ''}>
                {dateUtils.formatDate(task.scheduledDate, 'relative')}
              </span>
            </div>

            {/* Estimated Time */}
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>
                {Math.floor(task.estimatedTimeMinutes / 60)}h {task.estimatedTimeMinutes % 60}m
              </span>
            </div>

            {/* Completion Status */}
            {task.completed && task.completedAt && (
              <span className="text-green-600">
                Completed {dateUtils.formatDate(task.completedAt, 'relative')}
              </span>
            )}

            {/* Overdue indicator */}
            {isOverdue && (
              <span className="text-red-600 font-medium">
                Overdue
              </span>
            )}

            {/* Today indicator */}
            {isToday && !task.completed && (
              <span className="text-blue-600 font-medium">
                Due Today
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};