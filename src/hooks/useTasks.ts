// Custom hook for managing tasks

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskUpdatePayload, Goal } from '../types';
import { localStorageService } from '../services/localStorage';
import { PlanGenerator } from '../utils/planGenerator';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks from localStorage on mount
  useEffect(() => {
    try {
      const storedTasks = localStorageService.getTasks();
      setTasks(storedTasks);
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  const saveTasks = useCallback((updatedTasks: Task[]) => {
    try {
      localStorageService.saveTasks(updatedTasks);
      setTasks(updatedTasks);
      setError(null);
    } catch (err) {
      setError('Failed to save tasks');
      console.error('Error saving tasks:', err);
    }
  }, []);

  // Generate tasks for a goal
  const generateTasksForGoal = useCallback((goal: Goal) => {
    try {
      const newTasks = PlanGenerator.generatePlan(goal);
      const updatedTasks = [...tasks.filter(task => task.goalId !== goal.id), ...newTasks];
      saveTasks(updatedTasks);
      return newTasks;
    } catch (err) {
      setError('Failed to generate tasks');
      console.error('Error generating tasks:', err);
      return [];
    }
  }, [tasks, saveTasks]);

  // Update a task
  const updateTask = useCallback((taskId: string, updates: TaskUpdatePayload) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task };
        
        if (updates.completed !== undefined) {
          updatedTask.completed = updates.completed;
          updatedTask.completedAt = updates.completed ? new Date() : undefined;
        }
        
        return updatedTask;
      }
      return task;
    });
    
    saveTasks(updatedTasks);
  }, [tasks, saveTasks]);

  // Get tasks for a specific goal
  const getTasksForGoal = useCallback((goalId: string): Task[] => {
    return tasks.filter(task => task.goalId === goalId);
  }, [tasks]);

  // Get tasks for a specific date
  const getTasksForDate = useCallback((date: Date): Task[] => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    return tasks.filter(task => {
      const taskDate = new Date(task.scheduledDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === targetDate.getTime();
    });
  }, [tasks]);

  // Get today's tasks
  const getTodaysTasks = useCallback((): Task[] => {
    return getTasksForDate(new Date());
  }, [getTasksForDate]);

  // Get overdue tasks
  const getOverdueTasks = useCallback((): Task[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tasks.filter(task => {
      const taskDate = new Date(task.scheduledDate);
      taskDate.setHours(0, 0, 0, 0);
      return !task.completed && taskDate < today;
    });
  }, [tasks]);

  // Add a new task
  const addTask = useCallback((goalId: string, taskData: Omit<Task, 'id' | 'goalId'>) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      goalId,
      ...taskData,
    };
    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);
    return newTask;
  }, [tasks, saveTasks]);

  // Add multiple tasks at once
  const addMultipleTasks = useCallback((goalId: string, tasksData: Omit<Task, 'id' | 'goalId'>[]) => {
    const newTasks: Task[] = tasksData.map((taskData, index) => ({
      id: `task-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
      goalId,
      ...taskData,
    }));
    const updatedTasks = [...tasks, ...newTasks];
    saveTasks(updatedTasks);
    return newTasks;
  }, [tasks, saveTasks]);

  // Delete a single task
  const deleteTask = useCallback((taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    saveTasks(updatedTasks);
  }, [tasks, saveTasks]);

  // Delete tasks for a goal (when goal is deleted)
  const deleteTasksForGoal = useCallback((goalId: string) => {
    const updatedTasks = tasks.filter(task => task.goalId !== goalId);
    saveTasks(updatedTasks);
  }, [tasks, saveTasks]);

  return {
    tasks,
    loading,
    error,
    generateTasksForGoal,
    updateTask,
    addTask,
    addMultipleTasks,
    deleteTask,
    getTasksForGoal,
    getTasksForDate,
    getTodaysTasks,
    getOverdueTasks,
    deleteTasksForGoal,
  };
};