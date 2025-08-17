// LocalStorage service for data persistence

import { Goal, Task, Progress, AppSettings } from '../types';

const STORAGE_KEYS = {
  GOALS: 'autoGoalPlanner_goals',
  TASKS: 'autoGoalPlanner_tasks',
  PROGRESS: 'autoGoalPlanner_progress',
  SETTINGS: 'autoGoalPlanner_settings',
} as const;

class LocalStorageService {
  // Goals management
  saveGoals(goals: Goal[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    } catch (error) {
      console.error('Failed to save goals:', error);
      throw new Error('Failed to save goals to localStorage');
    }
  }

  getGoals(): Goal[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GOALS);
      if (!stored) return [];
      
      const goals = JSON.parse(stored);
      // Convert date strings back to Date objects
      return goals.map((goal: Goal) => ({
        ...goal,
        startDate: new Date(goal.startDate),
        endDate: new Date(goal.endDate),
        createdAt: new Date(goal.createdAt),
        updatedAt: new Date(goal.updatedAt),
      }));
    } catch (error) {
      console.error('Failed to load goals:', error);
      return [];
    }
  }

  // Tasks management
  saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks:', error);
      throw new Error('Failed to save tasks to localStorage');
    }
  }

  getTasks(): Task[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (!stored) return [];
      
      const tasks = JSON.parse(stored);
      return tasks.map((task: Task) => ({
        ...task,
        scheduledDate: new Date(task.scheduledDate),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      }));
    } catch (error) {
      console.error('Failed to load tasks:', error);
      return [];
    }
  }

  // Progress management
  saveProgress(progressData: Progress[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progressData));
    } catch (error) {
      console.error('Failed to save progress:', error);
      throw new Error('Failed to save progress to localStorage');
    }
  }

  getProgress(): Progress[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      if (!stored) return [];
      
      const progress = JSON.parse(stored);
      return progress.map((p: Progress) => ({
        ...p,
        lastActiveDate: p.lastActiveDate ? new Date(p.lastActiveDate) : undefined,
      }));
    } catch (error) {
      console.error('Failed to load progress:', error);
      return [];
    }
  }

  // Settings management
  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw new Error('Failed to save settings to localStorage');
    }
  }

  getSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!stored) {
        return this.getDefaultSettings();
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to load settings:', error);
      return this.getDefaultSettings();
    }
  }

  // Utility methods
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  exportData() {
    return {
      goals: this.getGoals(),
      tasks: this.getTasks(),
      progress: this.getProgress(),
      settings: this.getSettings(),
      exportDate: new Date().toISOString(),
    };
  }

  importData(data: {
    goals?: Goal[];
    tasks?: Task[];
    progress?: Progress[];
    settings?: AppSettings;
    exportDate?: string;
  }): void {
    try {
      if (data.goals) this.saveGoals(data.goals);
      if (data.tasks) this.saveTasks(data.tasks);
      if (data.progress) this.saveProgress(data.progress);
      if (data.settings) this.saveSettings(data.settings);
    } catch (error) {
      console.error('Failed to import data:', error);
      throw new Error('Failed to import data');
    }
  }

  private getDefaultSettings(): AppSettings {
    return {
      theme: 'system',
      defaultDailyTime: 60,
      reminderEnabled: false,
      reminderTime: '09:00',
    };
  }
}

export const localStorageService = new LocalStorageService();