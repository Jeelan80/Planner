// Core type definitions for the Auto Goal Planner app

export interface Goal {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  estimatedDailyTimeMinutes: number;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'completed' | 'paused';
  tags?: string[];
  priority: 'low' | 'medium' | 'high';
}

export interface Task {
  id: string;
  goalId: string;
  title: string;
  description?: string;
  scheduledDate: Date;
  estimatedTimeMinutes: number;
  completed: boolean;
  completedAt?: Date;
  order: number;
  category: 'daily' | 'milestone' | 'review';
}

export interface Progress {
  goalId: string;
  totalTasks: number;
  completedTasks: number;
  totalEstimatedMinutes: number;
  actualMinutesSpent: number;
  streak: number;
  lastActiveDate?: Date;
  completionPercentage: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  defaultDailyTime: number;
  reminderEnabled: boolean;
  reminderTime: string;
}

export interface PlanGenerationOptions {
  includeBreakDays: boolean;
  breakDayFrequency: number;
  includeMilestones: boolean;
  milestoneFrequency: number;
  autoAdjustForWeekends: boolean;
}

// API-like interfaces for component props
export interface GoalFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  estimatedDailyTimeMinutes: number;
  estimatedDailyTime: string; // e.g. '07:00 AM'
  priority: Goal['priority'];
  tags: string[];
}

export interface TaskUpdatePayload {
  completed?: boolean;
  actualTimeSpent?: number;
  notes?: string;
}