// Main App component with foundational structure

import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { PlannerForm } from './components/forms/PlannerForm';
import { GoalCard } from './components/planner/GoalCard';
import { TaskItem } from './components/planner/TaskItem';
import { Button } from './components/common/Button';
import { Card } from './components/common/Card';
import { useGoals } from './hooks/useGoals';
import { useTasks } from './hooks/useTasks';
import { GoalFormData, Goal } from './types';
import { Plus, Target, Calendar, CheckCircle } from 'lucide-react';

type ViewMode = 'dashboard' | 'create-goal' | 'goals' | 'today';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const { 
    goals, 
    loading: goalsLoading, 
    createGoal, 
    updateGoal, 
    deleteGoal,
    getActiveGoals 
  } = useGoals();

  const {
    tasks,
    generateTasksForGoal,
    updateTask,
    getTasksForGoal,
    getTodaysTasks,
    deleteTasksForGoal,
  } = useTasks();

  const handleCreateGoal = (goalData: GoalFormData) => {
    const newGoal = createGoal(goalData);
    generateTasksForGoal(newGoal);
    setCurrentView('dashboard');
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setCurrentView('create-goal');
  };

  const handleUpdateGoal = (goalData: GoalFormData) => {
    if (!editingGoal) return;
    
    updateGoal(editingGoal.id, {
      title: goalData.title,
      description: goalData.description,
      startDate: new Date(goalData.startDate),
      endDate: new Date(goalData.endDate),
      estimatedDailyTimeMinutes: goalData.estimatedDailyTimeMinutes,
      priority: goalData.priority,
      tags: goalData.tags,
    });

    // Regenerate tasks for updated goal
    const updatedGoal = { ...editingGoal, ...goalData };
    generateTasksForGoal(updatedGoal);
    
    setEditingGoal(null);
    setCurrentView('dashboard');
  };

  const handleDeleteGoal = (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this goal and all its tasks?')) {
      deleteGoal(goalId);
      deleteTasksForGoal(goalId);
    }
  };

  const handleToggleGoalStatus = (goalId: string, status: Goal['status']) => {
    updateGoal(goalId, { status });
  };

  const handleToggleTask = (taskId: string, completed: boolean) => {
    updateTask(taskId, { completed });
  };

  const activeGoals = getActiveGoals();
  const todaysTasks = getTodaysTasks();

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{activeGoals.length}</p>
              <p className="text-sm text-gray-600">Active Goals</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">
                {todaysTasks.filter(t => t.completed).length}
              </p>
              <p className="text-sm text-gray-600">Tasks Completed Today</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{todaysTasks.length}</p>
              <p className="text-sm text-gray-600">Tasks Due Today</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-4">
        <Button icon={Plus} onClick={() => setCurrentView('create-goal')}>
          Create New Goal
        </Button>
        <Button variant="outline" onClick={() => setCurrentView('today')}>
          View Today's Tasks
        </Button>
        <Button variant="outline" onClick={() => setCurrentView('goals')}>
          All Goals
        </Button>
      </div>

      {/* Today's Tasks Preview */}
      {todaysTasks.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Tasks</h2>
          <div className="space-y-3">
            {todaysTasks.slice(0, 3).map(task => {
              const goal = goals.find(g => g.id === task.goalId);
              return (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleTask}
                  showGoalTitle
                  goalTitle={goal?.title}
                />
              );
            })}
            {todaysTasks.length > 3 && (
              <Button
                variant="outline"
                onClick={() => setCurrentView('today')}
                className="w-full"
              >
                View All {todaysTasks.length} Tasks
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Recent Goals */}
      {activeGoals.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Goals</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeGoals.slice(0, 4).map(goal => {
              const goalTasks = getTasksForGoal(goal.id);
              const completedTasks = goalTasks.filter(t => t.completed);
              
              return (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  tasksCount={goalTasks.length}
                  completedTasksCount={completedTasks.length}
                  onEdit={handleEditGoal}
                  onDelete={handleDeleteGoal}
                  onToggleStatus={handleToggleGoalStatus}
                />
              );
            })}
          </div>
          {activeGoals.length > 4 && (
            <div className="mt-6 text-center">
              <Button variant="outline" onClick={() => setCurrentView('goals')}>
                View All Goals
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {goals.length === 0 && !goalsLoading && (
        <Card className="text-center py-12">
          <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No goals yet</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first goal!</p>
          <Button icon={Plus} onClick={() => setCurrentView('create-goal')}>
            Create Your First Goal
          </Button>
        </Card>
      )}
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">All Goals</h1>
        <Button icon={Plus} onClick={() => setCurrentView('create-goal')}>
          Create Goal
        </Button>
      </div>

      {goals.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {goals.map(goal => {
            const goalTasks = getTasksForGoal(goal.id);
            const completedTasks = goalTasks.filter(t => t.completed);
            
            return (
              <GoalCard
                key={goal.id}
                goal={goal}
                tasksCount={goalTasks.length}
                completedTasksCount={completedTasks.length}
                onEdit={handleEditGoal}
                onDelete={handleDeleteGoal}
                onToggleStatus={handleToggleGoalStatus}
              />
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No goals yet</h3>
          <p className="text-gray-600">Create your first goal to get started!</p>
        </Card>
      )}
    </div>
  );

  const renderTodaysTasks = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Today's Tasks</h1>

      {todaysTasks.length > 0 ? (
        <div className="space-y-4">
          {todaysTasks.map(task => {
            const goal = goals.find(g => g.id === task.goalId);
            return (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={handleToggleTask}
                showGoalTitle
                goalTitle={goal?.title}
              />
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks for today</h3>
          <p className="text-gray-600">You're all caught up!</p>
        </Card>
      )}
    </div>
  );

  const renderCreateGoal = () => (
    <div className="max-w-2xl mx-auto">
      <PlannerForm
        onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal}
        onCancel={() => {
          setEditingGoal(null);
          setCurrentView('dashboard');
        }}
        initialData={editingGoal ? {
          title: editingGoal.title,
          description: editingGoal.description || '',
          startDate: editingGoal.startDate.toISOString().split('T')[0],
          endDate: editingGoal.endDate.toISOString().split('T')[0],
          estimatedDailyTimeMinutes: editingGoal.estimatedDailyTimeMinutes,
          priority: editingGoal.priority,
          tags: editingGoal.tags || [],
        } : undefined}
      />
    </div>
  );

  if (goalsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout onSettingsClick={() => console.log('Settings clicked')}>
      {/* Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: Target },
            { key: 'today', label: 'Today', icon: Calendar },
            { key: 'goals', label: 'Goals', icon: CheckCircle },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setCurrentView(key as ViewMode)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${currentView === key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      {currentView === 'dashboard' && renderDashboard()}
      {currentView === 'create-goal' && renderCreateGoal()}
      {currentView === 'goals' && renderGoals()}
      {currentView === 'today' && renderTodaysTasks()}
    </Layout>
  );
}

export default App;