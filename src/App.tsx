// Main App component with foundational structure

import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { PlannerForm } from './components/forms/PlannerForm';
import { AIGoalPlanner } from './components/forms/AIGoalPlanner';
import { DetailedPlanViewer } from './components/forms/DetailedPlanViewer';
import { GoalCard } from './components/planner/GoalCard';
import { TaskItem } from './components/planner/TaskItem';
import { Button } from './components/common/Button';
import { Card } from './components/common/Card';
import { FirstTimeSetup } from './components/common/FirstTimeSetup';
import { PersonalizedWelcome } from './components/common/PersonalizedWelcome';
import { AIGoalPlannerCard } from './components/dashboard/AIGoalPlannerCard';
import { useGoals } from './hooks/useGoals';
import { useTasks } from './hooks/useTasks';
import { useUserPersonalization } from './hooks/useUserPersonalization';
import { GoalFormData, Goal } from './types';
import type { PlanningStrategy, GoalAnalysis } from './components/forms/AIGoalPlanner';
import { Plus, Target, Calendar, CheckCircle, Brain } from 'lucide-react';

type ViewMode = 'dashboard' | 'create-goal' | 'ai-planner' | 'plan-viewer' | 'edit-goal' | 'goals' | 'today';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<PlanningStrategy | null>(null);
  const [goalAnalysis, setGoalAnalysis] = useState<GoalAnalysis | null>(null);

  // User personalization
  const {
    userName,
    isFirstTime,
    isEditingName,
    getTimeBasedGreeting,
    saveName,
    startEditingName,
    cancelEditingName,
  } = useUserPersonalization();

  const { 
    goals, 
    loading: goalsLoading, 
    createGoal, 
    updateGoal, 
    deleteGoal,
    getActiveGoals 
  } = useGoals();

  const {
    // tasks,
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

  const handleAIPlanSelected = (strategy: PlanningStrategy, analysis: GoalAnalysis) => {
    setSelectedStrategy(strategy);
    setGoalAnalysis(analysis);
    setCurrentView('plan-viewer');
  };

  const handleSaveAIPlan = (planData: { strategy: PlanningStrategy; analysis: GoalAnalysis }) => {
    // Convert AI plan to GoalFormData format
    const goalData: GoalFormData = {
      title: planData.analysis.parsedGoal.title,
      description: `AI Generated Plan: ${planData.strategy.name}\n\n${planData.strategy.description}`,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + planData.analysis.parsedGoal.timeframe * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estimatedDailyTimeMinutes: planData.analysis.parsedGoal.dailyTime,
      estimatedDailyTime: `${Math.floor(planData.analysis.parsedGoal.dailyTime / 60).toString().padStart(2, '0')}:${(planData.analysis.parsedGoal.dailyTime % 60).toString().padStart(2, '0')} AM`,
      priority: 'medium' as const,
      tags: ['AI Generated', planData.strategy.name],
    };

    const newGoal = createGoal(goalData);
    generateTasksForGoal(newGoal);
    
    // Reset AI planner state
    setSelectedStrategy(null);
    setGoalAnalysis(null);
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
    const updatedGoal = {
      ...editingGoal,
      ...goalData,
      startDate: new Date(goalData.startDate),
      endDate: new Date(goalData.endDate)
    };
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
      {/* Personalized Welcome Section */}
      <PersonalizedWelcome
        userName={userName}
        greeting={getTimeBasedGreeting()}
        isEditing={isEditingName}
        onStartEdit={startEditingName}
        onSaveName={saveName}
        onCancelEdit={cancelEditingName}
      />

      {/* AI Goal Planner Card */}
      <AIGoalPlannerCard />

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg icon-float">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gradient">{activeGoals.length}</p>
              <p className="text-sm text-white/70 font-medium">Active Goals</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg icon-float">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gradient">
                {todaysTasks.filter(t => t.completed).length}
              </p>
              <p className="text-sm text-white/70 font-medium">Tasks Completed Today</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg icon-float">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gradient">{todaysTasks.length}</p>
              <p className="text-sm text-white/70 font-medium">Tasks Due Today</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-4">
        <Button icon={Plus} onClick={() => setCurrentView('create-goal')}>
          Create New Goal
        </Button>
        <Button icon={Brain} onClick={() => setCurrentView('ai-planner')}>
          AI Goal Planner
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
          <h2 className="text-xl font-semibold text-white mb-4">Active Goals</h2>
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
      {/* First Time Setup Modal */}
      {isFirstTime && <FirstTimeSetup onNameSubmit={saveName} />}

      {/* Main Content */}
      {currentView === 'dashboard' && renderDashboard()}
      {currentView === 'create-goal' && renderCreateGoal()}
      {currentView === 'ai-planner' && (
        <AIGoalPlanner onPlanSelected={handleAIPlanSelected} />
      )}
      {currentView === 'plan-viewer' && selectedStrategy && goalAnalysis && (
        <DetailedPlanViewer
          strategy={selectedStrategy}
          analysis={goalAnalysis}
          onSave={handleSaveAIPlan}
          onBack={() => setCurrentView('ai-planner')}
        />
      )}
      {currentView === 'goals' && renderGoals()}
      {currentView === 'today' && renderTodaysTasks()}
    </Layout>
  );
}

export default App;