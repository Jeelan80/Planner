// Plan generation utility for creating task schedules

import { Goal, Task, PlanGenerationOptions } from '../types';
import { dateUtils } from './dateUtils';
import { v4 as uuidv4 } from 'uuid';

export class PlanGenerator {
  static generatePlan(goal: Goal, options: PlanGenerationOptions = this.getDefaultOptions()): Task[] {
    const tasks: Task[] = [];
    const availableDates = this.getAvailableDates(goal, options);
    
    if (availableDates.length === 0) {
      throw new Error('No available dates for task scheduling');
    }

    // Calculate total available time
    const totalAvailableMinutes = availableDates.length * goal.estimatedDailyTimeMinutes;
    
    // Generate daily tasks
    const dailyTasks = this.generateDailyTasks(goal, availableDates);
    tasks.push(...dailyTasks);

    // Generate milestone tasks if enabled
    if (options.includeMilestones) {
      const milestoneTasks = this.generateMilestoneTasks(goal, availableDates, options.milestoneFrequency);
      tasks.push(...milestoneTasks);
    }

    return tasks.sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
  }

  private static getAvailableDates(goal: Goal, options: PlanGenerationOptions): Date[] {
    let dates = dateUtils.getDateRange(goal.startDate, goal.endDate);

    // Filter out weekends if auto-adjust is enabled
    if (options.autoAdjustForWeekends) {
      dates = dates.filter(date => !dateUtils.isWeekend(date));
    }

    // Add break days if enabled
    if (options.includeBreakDays && options.breakDayFrequency > 0) {
      dates = this.removeBreakDays(dates, options.breakDayFrequency);
    }

    return dates;
  }

  private static removeBreakDays(dates: Date[], frequency: number): Date[] {
    return dates.filter((_, index) => (index + 1) % (frequency + 1) !== 0);
  }

  private static generateDailyTasks(goal: Goal, availableDates: Date[]): Task[] {
    return availableDates.map((date, index) => ({
      id: uuidv4(),
      goalId: goal.id,
      title: `Day ${index + 1}: ${goal.title}`,
      description: `Daily progress towards "${goal.title}"`,
      scheduledDate: date,
      estimatedTimeMinutes: goal.estimatedDailyTimeMinutes,
      completed: false,
      order: index,
      category: 'daily' as const,
    }));
  }

  private static generateMilestoneTasks(goal: Goal, availableDates: Date[], frequency: number): Task[] {
    const milestones: Task[] = [];
    const milestoneIndices = this.getMilestoneIndices(availableDates.length, frequency);

    milestoneIndices.forEach((index, milestoneNumber) => {
      const date = availableDates[index];
      milestones.push({
        id: uuidv4(),
        goalId: goal.id,
        title: `Milestone ${milestoneNumber + 1}: Review Progress`,
        description: `Review and assess progress on "${goal.title}"`,
        scheduledDate: date,
        estimatedTimeMinutes: Math.ceil(goal.estimatedDailyTimeMinutes * 0.5), // 50% of daily time
        completed: false,
        order: index + 1000, // Higher order to show after daily tasks
        category: 'milestone' as const,
      });
    });

    return milestones;
  }

  private static getMilestoneIndices(totalDays: number, frequency: number): number[] {
    const indices: number[] = [];
    for (let i = frequency - 1; i < totalDays; i += frequency) {
      indices.push(i);
    }
    return indices;
  }

  private static getDefaultOptions(): PlanGenerationOptions {
    return {
      includeBreakDays: false,
      breakDayFrequency: 7,
      includeMilestones: true,
      milestoneFrequency: 7,
      autoAdjustForWeekends: true,
    };
  }

  // Utility method to recalculate plan when goal is updated
  static updatePlan(goal: Goal, existingTasks: Task[], options?: PlanGenerationOptions): Task[] {
    // Remove old tasks for this goal
    const otherTasks = existingTasks.filter(task => task.goalId !== goal.id);
    
    // Generate new tasks
    const newTasks = this.generatePlan(goal, options);
    
    return [...otherTasks, ...newTasks];
  }
}

// Note: We'll need to install uuid for generating IDs
// This will be handled in the package installation step