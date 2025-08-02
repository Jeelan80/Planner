// Component for displaying individual goals

import React from 'react';
import { Goal } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Calendar, Clock, Tag, Edit, Trash2, Play, Pause } from 'lucide-react';
import { dateUtils } from '../../utils/dateUtils';

interface GoalCardProps {
  goal: Goal;
  tasksCount?: number;
  completedTasksCount?: number;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goalId: string) => void;
  onToggleStatus?: (goalId: string, status: Goal['status']) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  tasksCount = 0,
  completedTasksCount = 0,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const progress = tasksCount > 0 ? (completedTasksCount / tasksCount) * 100 : 0;
  const daysRemaining = dateUtils.getDaysBetween(new Date(), goal.endDate);
  const isOverdue = dateUtils.isPast(goal.endDate) && goal.status === 'active';

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Card hover className="relative">
      {/* Status indicator */}
      <div className="absolute top-4 right-4">
        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(goal.status)}`}>
          {goal.status}
        </span>
      </div>

      {/* Goal Header */}
      <div className="mb-4 pr-20">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {goal.title}
        </h3>
        {goal.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {goal.description}
          </p>
        )}
      </div>

      {/* Goal Details */}
      <div className="space-y-3 mb-4">
        {/* Date Range */}
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>
            {dateUtils.formatDate(goal.startDate)} - {dateUtils.formatDate(goal.endDate)}
          </span>
          {isOverdue && (
            <span className="ml-2 text-red-600 font-medium">
              (Overdue)
            </span>
          )}
        </div>

        {/* Daily Time */}
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>
            {Math.floor(goal.estimatedDailyTimeMinutes / 60)}h {goal.estimatedDailyTimeMinutes % 60}m daily
          </span>
        </div>

        {/* Priority */}
        <div className="flex items-center">
          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(goal.priority)}`}>
            {goal.priority} priority
          </span>
          {daysRemaining >= 0 && (
            <span className="ml-2 text-xs text-gray-500">
              {daysRemaining} days remaining
            </span>
          )}
        </div>

        {/* Tags */}
        {goal.tags && goal.tags.length > 0 && (
          <div className="flex items-center">
            <Tag className="w-4 h-4 mr-2 text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {goal.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {tasksCount > 0 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">
              {completedTasksCount}/{tasksCount} tasks ({Math.round(progress)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="flex space-x-2">
          {onEdit && (
            <Button
              size="sm"
              variant="outline"
              icon={Edit}
              onClick={() => onEdit(goal)}
            >
              Edit
            </Button>
          )}
          
          {onToggleStatus && (
            <Button
              size="sm"
              variant="outline"
              icon={goal.status === 'active' ? Pause : Play}
              onClick={() => onToggleStatus(
                goal.id, 
                goal.status === 'active' ? 'paused' : 'active'
              )}
            >
              {goal.status === 'active' ? 'Pause' : 'Resume'}
            </Button>
          )}
        </div>

        {onDelete && (
          <Button
            size="sm"
            variant="ghost"
            icon={Trash2}
            onClick={() => onDelete(goal.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          />
        )}
      </div>
    </Card>
  );
};