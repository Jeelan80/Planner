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
  onViewDetails?: (goal: Goal) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  tasksCount = 0,
  completedTasksCount = 0,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewDetails,
}) => {
  const progress = tasksCount > 0 ? (completedTasksCount / tasksCount) * 100 : 0;
  const daysRemaining = dateUtils.getDaysBetween(new Date(), goal.endDate);
  const isOverdue = dateUtils.isPast(goal.endDate) && goal.status === 'active';

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-800 bg-red-200 dark:text-red-300 dark:bg-red-700/90 font-extrabold shadow-sm border border-red-300 dark:border-red-400';
      case 'medium': return 'text-amber-800 bg-amber-200 dark:text-yellow-300 dark:bg-yellow-700/90 font-extrabold shadow-sm border border-amber-300 dark:border-yellow-400';
      case 'low': return 'text-emerald-800 bg-emerald-200 dark:text-green-300 dark:bg-green-700/90 font-extrabold shadow-sm border border-emerald-300 dark:border-green-400';
      default: return 'text-slate-800 bg-slate-200 dark:text-white dark:bg-slate-700/90 font-extrabold shadow-sm border border-slate-300 dark:border-slate-400';
    }
  };

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'active': return 'text-blue-800 bg-blue-200 dark:text-blue-300 dark:bg-blue-700/90 font-extrabold shadow-sm border border-blue-300 dark:border-blue-400';
      case 'completed': return 'text-emerald-800 bg-emerald-200 dark:text-green-300 dark:bg-green-700/90 font-extrabold shadow-sm border border-emerald-300 dark:border-green-400';
      case 'paused': return 'text-slate-800 bg-slate-200 dark:text-white dark:bg-slate-700/90 font-extrabold shadow-sm border border-slate-300 dark:border-slate-400';
      default: return 'text-slate-800 bg-slate-200 dark:text-white dark:bg-slate-700/90 font-extrabold shadow-sm border border-slate-300 dark:border-slate-400';
    }
  };


  // Helper to format date and time for calendar links
  const pad = (n: number) => n.toString().padStart(2, '0');
  const getEventTimes = () => {
    // Create start date at 9 AM local time for the goal start date
    const startDate = new Date(goal.startDate);
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 9, 0, 0);
    
    // Calculate end time based on estimated daily time
    const duration = goal.estimatedDailyTimeMinutes || 60;
    const end = new Date(start.getTime() + duration * 60000);
    
    // For recurring events, we need the goal end date
    const goalEndDate = new Date(goal.endDate);
    const recurringEnd = new Date(goalEndDate.getFullYear(), goalEndDate.getMonth(), goalEndDate.getDate(), 23, 59, 59);
    
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
      googleRecurringEnd: toGoogleUTC(recurringEnd),
      msStart: toMicrosoft(start),
      msEnd: toMicrosoft(end),
      msRecurringEnd: toMicrosoft(recurringEnd)
    };
  };
  const eventTimes = getEventTimes();

  // Create comprehensive event description
  const createEventDescription = () => {
    const lines = [];
    
    // Goal description
    if (goal.description) {
      lines.push(`📝 Description: ${goal.description}`);
      lines.push('');
    }
    
    // Goal details
    lines.push(`🎯 Goal: ${goal.title}`);
    lines.push(`📅 Duration: ${dateUtils.formatDate(goal.startDate)} - ${dateUtils.formatDate(goal.endDate)}`);
    lines.push(`⏰ Daily Time: ${Math.floor(goal.estimatedDailyTimeMinutes / 60)}h ${goal.estimatedDailyTimeMinutes % 60}m`);
    lines.push(`🔥 Priority: ${goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)}`);
    lines.push(`📊 Status: ${goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}`);
    
    // Progress information
    if (tasksCount > 0) {
      lines.push(`📈 Progress: ${completedTasksCount}/${tasksCount} tasks completed (${Math.round(progress)}%)`);
    }
    
    // Tags
    if (goal.tags && goal.tags.length > 0) {
      lines.push(`🏷️ Tags: ${goal.tags.join(', ')}`);
    }
    
    lines.push('');
    lines.push('📱 Created with Auto Goal Planner');
    lines.push('🚀 AI-Powered Goal Planning & Tracking');
    
    return lines.join('\n');
  };

  // Create event title with priority indicator
  const createEventTitle = () => {
    const priorityEmoji = {
      high: '🔴',
      medium: '🟡', 
      low: '🟢'
    };
    
    return `${priorityEmoji[goal.priority]} ${goal.title} - Daily Session`;
  };

  // Create location string
  const createLocation = () => {
    return 'Auto Goal Planner - Focus Session';
  };

  // Generate recurrence rule for daily events (Google Calendar format)
  const getRecurrenceRule = () => {
    const totalDays = dateUtils.getDaysBetween(goal.startDate, goal.endDate) + 1;
    return `RRULE:FREQ=DAILY;COUNT=${totalDays}`;
  };

  return (
    <Card 
      hover 
      className="relative goal-card-enhanced cursor-pointer" 
      onClick={() => onViewDetails?.(goal)}
    >
      {/* Goal Header with inline status */}
      <div className="mb-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white drop-shadow-sm flex-1">
            {goal.title}
          </h3>
          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(goal.status)} flex-shrink-0`}>
            {goal.status}
          </span>
        </div>
        {goal.description && (
          <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 font-medium">
            {goal.description}
          </p>
        )}
      </div>

      {/* Goal Details */}
      <div className="space-y-3 mb-4">
        {/* Date Range */}
        <div className="flex items-center text-sm text-slate-800 dark:text-slate-200 font-medium">
          <Calendar className="w-4 h-4 mr-2 text-slate-600 dark:text-slate-400" />
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
        <div className="flex items-center text-sm text-slate-800 dark:text-slate-200 font-medium">
          <Clock className="w-4 h-4 mr-2 text-slate-600 dark:text-slate-400" />
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
            <span className="ml-2 text-xs text-slate-700 dark:text-yellow-300 font-extrabold bg-slate-100 dark:bg-yellow-700/90 px-2 py-1 rounded-md border border-slate-200 dark:border-yellow-400">{daysRemaining} days remaining
            </span>
          )}
        </div>

        {/* Tags */}
        {goal.tags && goal.tags.length > 0 && (
          <div className="flex items-center">
            <Tag className="w-4 h-4 mr-2 text-slate-600 dark:text-slate-400" />
            <div className="flex flex-wrap gap-1">
              {goal.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs text-slate-800 dark:text-blue-300 bg-slate-200 dark:bg-blue-700/90 rounded-md font-extrabold border border-slate-300 dark:border-blue-400 shadow-sm"
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
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Progress</span>
            <span className="text-sm text-slate-800 dark:text-slate-200 font-bold bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 shadow-sm">
              <span className="text-slate-900 dark:text-white font-black opacity-100">{completedTasksCount}/{tasksCount} tasks ({Math.round(progress)}%)</span>
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
      <div className="flex justify-between items-center pt-4 border-t border-slate-300 dark:border-slate-600" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-wrap gap-3 items-center justify-start">
          {onEdit && (
            <Button
              size="sm"
              variant="outline"
              icon={Edit}
              onClick={() => onEdit(goal)}
              className="flex-shrink-0 bg-gray-100 dark:bg-slate-800 border-2 border-gray-400 dark:border-slate-600 !text-gray-800 dark:!text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700 shadow-md font-semibold hover:!text-gray-900 dark:hover:!text-white"
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
              className="flex-shrink-0 bg-gray-100 dark:bg-slate-800 border-2 border-gray-400 dark:border-slate-600 !text-gray-800 dark:!text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700 shadow-md font-semibold hover:!text-gray-900 dark:hover:!text-white"
            >
              {goal.status === 'active' ? 'Pause' : 'Resume'}
            </Button>
          )}

          {/* Calendar buttons in a separate row on mobile */}
          <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
            <a
              href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(createEventTitle())}&details=${encodeURIComponent(createEventDescription())}&dates=${eventTimes.googleStart}/${eventTimes.googleEnd}&location=${encodeURIComponent(createLocation())}&recur=${encodeURIComponent(getRecurrenceRule())}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 text-xs font-semibold rounded-lg bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 transition-all border border-green-200 dark:border-green-700 shadow-sm backdrop-blur-sm flex-shrink-0"
              title="Add recurring daily sessions to Google Calendar"
            >
              <Calendar className="w-4 h-4 mr-1.5 text-green-600 dark:text-green-400" />
              <span className="hidden sm:inline">Google</span>
              <span className="sm:hidden">G</span>
            </a>
            <a
              href={`https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(createEventTitle())}&body=${encodeURIComponent(createEventDescription())}&startdt=${eventTimes.msStart}&enddt=${eventTimes.msEnd}&location=${encodeURIComponent(createLocation())}&allday=false&rru=daily&until=${eventTimes.msRecurringEnd}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 text-xs font-semibold rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all border border-blue-200 dark:border-blue-700 shadow-sm backdrop-blur-sm flex-shrink-0"
              title="Add recurring daily sessions to Microsoft Calendar"
            >
              <Calendar className="w-4 h-4 mr-1.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">Outlook</span>
              <span className="sm:hidden">O</span>
            </a>
          </div>
        </div>

        {onDelete && (
          <Button
            size="sm"
            variant="outline"
            icon={Trash2}
            onClick={() => onDelete(goal.id)}
            className="!text-red-700 dark:!text-red-400 hover:!text-red-800 dark:hover:!text-red-300 bg-red-50 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/30 font-semibold border-2 border-red-400 dark:border-red-700 shadow-md flex-shrink-0"
          />
        )}
      </div>
    </Card>
  );
};