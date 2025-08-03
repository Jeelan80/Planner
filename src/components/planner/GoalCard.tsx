// Component for displaying individual goals

import React from 'react';
import styles from './GoalCard.module.css';
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
      case 'high': return 'text-red-800 bg-red-200 shadow-sm border border-red-300';
      case 'medium': return 'text-amber-800 bg-amber-200 shadow-sm border border-amber-300';
      case 'low': return 'text-emerald-800 bg-emerald-200 shadow-sm border border-emerald-300';
      default: return 'text-slate-800 bg-slate-200 shadow-sm border border-slate-300';
    }
  };

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'active': return 'text-blue-800 bg-blue-200 shadow-sm border border-blue-300';
      case 'completed': return 'text-emerald-800 bg-emerald-200 shadow-sm border border-emerald-300';
      case 'paused': return 'text-slate-800 bg-slate-200 shadow-sm border border-slate-300';
      default: return 'text-slate-800 bg-slate-200 shadow-sm border border-slate-300';
    }
  };


  // Helper to format date and time for calendar links
  const pad = (n: number) => n.toString().padStart(2, '0');
  const getEventTimes = () => {
    // Create start date at 9 AM local time
    const startDate = new Date(goal.startDate);
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 9, 0, 0);
    
    // Calculate end time based on estimated daily time
    const duration = goal.estimatedDailyTimeMinutes || 60;
    const end = new Date(start.getTime() + duration * 60000);
    
    // Google Calendar format: yyyyMMddTHHmmssZ (UTC)
    const toGoogleUTC = (d: Date) => {
      const utc = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
      return `${utc.getFullYear()}${pad(utc.getMonth() + 1)}${pad(utc.getDate())}T${pad(utc.getHours())}${pad(utc.getMinutes())}${pad(utc.getSeconds())}Z`;
    };
    
    // Microsoft Calendar format: ISO string
    const toMicrosoft = (d: Date) => d.toISOString().slice(0, 19);
    
    return {
      googleStart: toGoogleUTC(start),
      googleEnd: toGoogleUTC(end),
      msStart: toMicrosoft(start),
      msEnd: toMicrosoft(end)
    };
  };
  const eventTimes = getEventTimes();

  return (
    <Card hover className="relative goal-card-enhanced">
      {/* Status indicator */}
      <div className="absolute top-4 right-4">
        <span className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusColor(goal.status)}`}>
          {goal.status}
        </span>
      </div>

      {/* Goal Header */}
      <div className="mb-4 pr-24">
        <h3 className="text-xl font-bold text-slate-900 mb-2 drop-shadow-sm">
          {goal.title}
        </h3>
        {goal.description && (
          <p className="text-sm text-slate-700 line-clamp-2 font-medium">
            {goal.description}
          </p>
        )}
      </div>

      {/* Goal Details */}
      <div className="space-y-3 mb-4">
        {/* Date Range */}
        <div className="flex items-center text-sm text-slate-800 font-medium">
          <Calendar className="w-4 h-4 mr-2 text-slate-600" />
          <span>
            {dateUtils.formatDate(goal.startDate)} - {dateUtils.formatDate(goal.endDate)}
          </span>
          {isOverdue && (
            <span className="ml-2 text-red-700 font-bold bg-red-100 px-2 py-1 rounded-md">
              (Overdue)
            </span>
          )}
        </div>

        {/* Daily Time */}
        <div className="flex items-center text-sm text-slate-800 font-medium">
          <Clock className="w-4 h-4 mr-2 text-slate-600" />
          <span>
            {Math.floor(goal.estimatedDailyTimeMinutes / 60)}h {goal.estimatedDailyTimeMinutes % 60}m daily
          </span>
        </div>

        {/* Priority */}
        <div className="flex items-center">
          <span className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full ${getPriorityColor(goal.priority)}`}>
            {goal.priority} priority
          </span>
          {daysRemaining >= 0 && (
            <span className="ml-2 text-xs text-slate-700 font-medium bg-slate-100 px-2 py-1 rounded-md border border-slate-200">{daysRemaining} days remaining
            </span>
          )}
        </div>

        {/* Tags */}
        {goal.tags && goal.tags.length > 0 && (
          <div className="flex items-center">
            <Tag className="w-4 h-4 mr-2 text-slate-600" />
            <div className="flex flex-wrap gap-1">
              {goal.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs text-slate-800 bg-slate-200 rounded-md font-medium border border-slate-300 shadow-sm"
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
            <span className="text-sm font-bold text-slate-800">Progress</span>
            <span className="text-sm text-slate-700 font-semibold bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
              {completedTasksCount}/{tasksCount} tasks ({Math.round(progress)}%)
            </span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={
                `${styles.progress} ${styles[`progress${Math.round(progress / 10) * 10}`]}`
              }
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-300">
        <div className="flex flex-wrap gap-2 items-center">
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

          {/* Add to Calendar Buttons */}
          <a
            href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(goal.title)}&details=${encodeURIComponent(`${goal.description || ''}\n\nPriority: ${goal.priority}\nEstimated daily time: ${Math.floor(goal.estimatedDailyTimeMinutes / 60)}h ${goal.estimatedDailyTimeMinutes % 60}m`)}&dates=${eventTimes.googleStart}/${eventTimes.googleEnd}&location=${encodeURIComponent('Auto Goal Planner')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-100 text-green-800 hover:bg-green-200 transition-all border border-green-200 shadow-sm"
            title="Add to Google Calendar"
          >
            <Calendar className="w-4 h-4 mr-1 text-green-600" /> Google Calendar
          </a>
          <a
            href={`https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(goal.title)}&body=${encodeURIComponent(`${goal.description || ''}\n\nPriority: ${goal.priority}\nEstimated daily time: ${Math.floor(goal.estimatedDailyTimeMinutes / 60)}h ${goal.estimatedDailyTimeMinutes % 60}m`)}&startdt=${eventTimes.msStart}&enddt=${eventTimes.msEnd}&location=${encodeURIComponent('Auto Goal Planner')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 transition-all border border-blue-200 shadow-sm"
            title="Add to Microsoft Calendar"
          >
            <Calendar className="w-4 h-4 mr-1 text-blue-600" /> Microsoft Calendar
          </a>
        </div>

        {onDelete && (
          <Button
            size="sm"
            variant="ghost"
            icon={Trash2}
            onClick={() => onDelete(goal.id)}
            className="text-red-700 hover:text-red-800 hover:bg-red-100 font-semibold border border-red-200 shadow-sm"
          />
        )}
      </div>
    </Card>
  );
};