// Custom hook for managing goals

import { useState, useEffect, useCallback } from 'react';
import { Goal, GoalFormData } from '../types';
import { localStorageService } from '../services/localStorage';
import { v4 as uuidv4 } from 'uuid';

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load goals from localStorage on mount
  useEffect(() => {
    try {
      const storedGoals = localStorageService.getGoals();
      setGoals(storedGoals);
    } catch (err) {
      setError('Failed to load goals');
      console.error('Error loading goals:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save goals to localStorage whenever goals change
  const saveGoals = useCallback((updatedGoals: Goal[]) => {
    try {
      localStorageService.saveGoals(updatedGoals);
      setGoals(updatedGoals);
      setError(null);
    } catch (err) {
      setError('Failed to save goals');
      console.error('Error saving goals:', err);
    }
  }, []);

  // Create a new goal
  const createGoal = useCallback((goalData: GoalFormData) => {
    const newGoal: Goal = {
      id: uuidv4(),
      title: goalData.title,
      description: goalData.description,
      startDate: new Date(goalData.startDate),
      endDate: new Date(goalData.endDate),
      estimatedDailyTimeMinutes: goalData.estimatedDailyTimeMinutes,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      tags: goalData.tags,
      priority: goalData.priority,
    };

    const updatedGoals = [...goals, newGoal];
    saveGoals(updatedGoals);
    return newGoal;
  }, [goals, saveGoals]);

  // Update an existing goal
  const updateGoal = useCallback((goalId: string, updates: Partial<Goal>) => {
    const updatedGoals = goals.map(goal =>
      goal.id === goalId
        ? { ...goal, ...updates, updatedAt: new Date() }
        : goal
    );
    saveGoals(updatedGoals);
  }, [goals, saveGoals]);

  // Delete a goal
  const deleteGoal = useCallback((goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    saveGoals(updatedGoals);
  }, [goals, saveGoals]);

  // Get goal by ID
  const getGoalById = useCallback((goalId: string): Goal | undefined => {
    return goals.find(goal => goal.id === goalId);
  }, [goals]);

  // Get active goals
  const getActiveGoals = useCallback((): Goal[] => {
    return goals.filter(goal => goal.status === 'active');
  }, [goals]);

  // Get completed goals
  const getCompletedGoals = useCallback((): Goal[] => {
    return goals.filter(goal => goal.status === 'completed');
  }, [goals]);

  return {
    goals,
    loading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    getGoalById,
    getActiveGoals,
    getCompletedGoals,
  };
};