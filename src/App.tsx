// Main App component with foundational structure

import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { PlannerForm } from './components/forms/PlannerForm';
import { AIGoalPlanner } from './components/forms/AIGoalPlanner';

import { GoalCard } from './components/planner/GoalCard';

import { Button } from './components/common/Button';
import { Card } from './components/common/Card';
import { FirstTimeSetup } from './components/common/FirstTimeSetup';
import { PersonalizedWelcome } from './components/common/PersonalizedWelcome';
import { AIGoalPlannerCard } from './components/dashboard/AIGoalPlannerCard';
import { GoalPlanningModal } from './components/dashboard/GoalPlanningModal';
import { GoalDetailsModal } from './components/dashboard/GoalDetailsModal';

import { useGoals } from './hooks/useGoals';
import { useTasks } from './hooks/useTasks';
import { useUserPersonalization } from './hooks/useUserPersonalization';
import { GoalFormData, Goal } from './types';
import type { PlanningStrategy, GoalAnalysis } from './components/forms/AIGoalPlanner';
import { Plus, Target, Calendar, CheckCircle, Brain, Clock, TrendingUp, Shield, Sparkles } from 'lucide-react';

type ViewMode = 'dashboard' | 'create-goal' | 'ai-planner' | 'goals' | 'today';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [isGoalPlanningModalOpen, setIsGoalPlanningModalOpen] = useState(false);
  const [selectedGoalForDetails, setSelectedGoalForDetails] = useState<Goal | null>(null);

  const [isCustomViewMode, setIsCustomViewMode] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);



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
    addTask,
    addMultipleTasks,
    deleteTask,
    getTasksForGoal,
    getTodaysTasks,
    deleteTasksForGoal,
  } = useTasks();

  const handleCreateGoal = (goalData: GoalFormData) => {
    const newGoal = createGoal(goalData);
    generateTasksForGoal(newGoal);
    setCurrentView('dashboard');
  };

  const handleGoalPlanningModalStrategySelected = (strategy: PlanningStrategy, analysis: GoalAnalysis) => {
    console.log('Creating goal with strategy:', strategy.name);
    console.log('Analysis:', analysis);

    // Convert AI plan to GoalFormData format
    const goalData: GoalFormData = {
      title: analysis.parsedGoal.title,
      description: `AI Generated Plan: ${strategy.name}\n\n${strategy.description}`,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + analysis.parsedGoal.timeframe * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estimatedDailyTimeMinutes: analysis.parsedGoal.dailyTime,
      estimatedDailyTime: `${Math.floor(analysis.parsedGoal.dailyTime / 60).toString().padStart(2, '0')}:${(analysis.parsedGoal.dailyTime % 60).toString().padStart(2, '0')} AM`,
      priority: 'medium' as const,
      tags: ['AI Generated', strategy.name],
    };

    console.log('Goal data to create:', goalData);

    const newGoal = createGoal(goalData);
    console.log('Created goal:', newGoal);

    // Create tasks from the AI-generated plan instead of using generic generator
    createTasksFromAIPlan(newGoal, strategy);
    console.log('Generated AI tasks for goal');

    setIsGoalPlanningModalOpen(false);

    // Show success message or navigate to the goal
    console.log('Goal created successfully:', newGoal.title);
    console.log('Current goals count:', goals.length);
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
      endDate: new Date(goalData.endDate),
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

  const handleViewGoalDetails = (goal: Goal) => {
    console.log('Opening goal details for:', goal.title);
    setSelectedGoalForDetails(goal);
  };

  const handleCloseGoalDetails = () => {
    setSelectedGoalForDetails(null);
  };

  const createTasksFromAIPlan = (goal: Goal, strategy: PlanningStrategy) => {
    console.log('Creating tasks from AI plan:', strategy.plan.length, 'tasks');

    const tasksData = strategy.plan.map((planTask) => ({
      title: planTask.task,
      description: `${strategy.name} - Day ${planTask.day}`,
      scheduledDate: new Date(goal.startDate.getTime() + (planTask.day - 1) * 24 * 60 * 60 * 1000),
      estimatedTimeMinutes: planTask.duration,
      completed: false,
      order: planTask.day,
      category: (strategy.id === 'milestone' ? 'milestone' : 'daily') as 'milestone' | 'daily',
    }));

    // Add all tasks at once to avoid race conditions
    const createdTasks = addMultipleTasks(goal.id, tasksData);
    console.log('Created tasks:', createdTasks.length);

    return createdTasks;
  };

  const activeGoals = getActiveGoals();
  const todaysTasks = getTodaysTasks();

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Personalized Welcome Section */}
      <div>
        <PersonalizedWelcome
          userName={userName}
          greeting={getTimeBasedGreeting()}
          isEditing={isEditingName}
          onStartEdit={startEditingName}
          onSaveName={saveName}
          onCancelEdit={cancelEditingName}
        />
      </div>

      {/* AI Goal Planner Card - Show at top if no goals exist */}
      {goals.length === 0 && (
        <AIGoalPlannerCard onStrategySelected={handleGoalPlanningModalStrategySelected} />
      )}

      {/* Header Stats - Only show if user has goals */}
      {goals.length > 0 && (
        <div className="space-y-6">
          {/* Stats Cards with Customize Button */}
          <div className="relative">
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

            {/* Customize View Button - Floating in top right */}
            <div className="absolute -top-2 -right-2 z-10">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsCustomViewMode(!isCustomViewMode)}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-purple-300 dark:border-purple-600 !text-purple-700 dark:!text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                title={isCustomViewMode ? "Switch to Goals View" : "Switch to Focus View"}
              >
                {isCustomViewMode ? (
                  <>
                    <Brain className="w-4 h-4 mr-1" />
                    Plan With AI
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 mr-1" />
                    Show Goals
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* AI Goal Planner Card - Show after stats if goals exist and not in custom view mode */}
      {goals.length > 0 && !isCustomViewMode && (
        <div className="transition-all duration-500 ease-in-out">
          <AIGoalPlannerCard onStrategySelected={handleGoalPlanningModalStrategySelected} />
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap justify-center gap-4 mt-8 px-4">
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



      {/* Recent Goals - Always show when goals exist */}
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
                  onViewDetails={handleViewGoalDetails}
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

      {/* Feature Highlights for First-Time Users */}
      {goals.length === 0 && !goalsLoading && (
        <div className="space-y-8">
          {/* Why Choose Our AI Planner */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-3 flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              Why Choose AI Goal Planning?
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Experience the power of intelligent planning that adapts to your lifestyle and maximizes your success rate
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* AI-Powered Planning */}
            <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:bg-white/15 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI-Powered</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Smart algorithms analyze your goals and create personalized action plans
              </p>
            </div>

            {/* Time Optimization */}
            <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:bg-white/15 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Time Optimized</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Efficient scheduling that fits your daily routine and maximizes productivity
              </p>
            </div>

            {/* Progress Tracking */}
            <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:bg-white/15 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Tracking</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Visual progress indicators and milestone celebrations keep you motivated
              </p>
            </div>

            {/* Privacy First */}
            <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:bg-white/15 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Privacy First</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Your data stays in your browser. No servers, no tracking, complete privacy
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">How AI Goal Planning Works</h3>
              <p className="text-white/70">Simple steps to transform your ideas into actionable plans</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-3">
                  <span className="text-white font-bold">1</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Describe Your Goal</h4>
                <p className="text-white/70 text-sm">Tell our AI what you want to achieve in natural language</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-3">
                  <span className="text-white font-bold">2</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Get Smart Strategies</h4>
                <p className="text-white/70 text-sm">AI analyzes and suggests multiple approaches tailored to you</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-600 rounded-full mx-auto mb-3">
                  <span className="text-white font-bold">3</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Track Progress</h4>
                <p className="text-white/70 text-sm">Follow your personalized plan with daily tasks and milestones</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <p className="text-white/80 mb-6 text-lg">
              Ready to transform your dreams into achievable milestones?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                icon={Brain}
                onClick={() => setCurrentView('ai-planner')}
                className="btn-gradient text-white font-bold py-4 px-8 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
              >
                Start AI Planning
              </Button>
              <Button
                icon={Plus}
                onClick={() => setCurrentView('create-goal')}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Create Manual Goal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => setCurrentView('dashboard')}
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-2xl font-semibold text-white">All Goals</h1>
        </div>
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
                onViewDetails={handleViewGoalDetails}
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

  const renderTodaysTasks = () => {
    const completedTasks = todaysTasks.filter(t => t.completed);
    const progress = todaysTasks.length > 0 ? (completedTasks.length / todaysTasks.length) * 100 : 0;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setCurrentView('dashboard')}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              ← Back to Dashboard
            </Button>
            <h1 className="text-2xl font-semibold text-white">Today's Tasks</h1>
          </div>
          <span className="text-sm text-white/70">
            {completedTasks.length}/{todaysTasks.length} completed ({Math.round(progress)}%)
          </span>
        </div>

        {/* Progress Bar */}
        {todaysTasks.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-white">Today's Progress</h3>
              <span className="text-sm text-white/70">
                {Math.round(progress)}% complete
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {todaysTasks.length > 0 ? (
          <div className="space-y-4">
            {todaysTasks.map(task => {
              const goal = goals.find(g => g.id === task.goalId);
              return (
                <div
                  key={task.id}
                  className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 ${task.completed ? 'opacity-75' : ''
                    }`}
                >
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => handleToggleTask(task.id, !task.completed)}
                      className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-white/40 hover:border-white/60'
                        }`}
                    >
                      {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
                    </button>
                    <div className="flex-1">
                      <h4 className={`font-semibold text-lg ${task.completed ? 'line-through text-white/60' : 'text-white'}`}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className={`text-sm mt-1 ${task.completed ? 'line-through text-white/50' : 'text-white/80'}`}>
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 mt-3">
                        <div className="flex items-center space-x-2 text-xs text-white/60">
                          <Calendar className="w-4 h-4" />
                          <span>{task.scheduledDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-white/60">
                          <Clock className="w-4 h-4" />
                          <span>{task.estimatedTimeMinutes}min</span>
                        </div>
                        {goal && (
                          <div className="flex items-center space-x-2 text-xs text-white/60">
                            <Target className="w-4 h-4" />
                            <span>{goal.title}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${task.category === 'milestone'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                          {task.category === 'milestone' ? 'Milestone' : 'Daily Task'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
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
  };

  const renderCreateGoal = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          onClick={() => {
            setEditingGoal(null);
            setCurrentView('dashboard');
          }}
          variant="outline"
          size="sm"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          ← Back to Dashboard
        </Button>
        <h1 className="text-2xl font-semibold text-white">
          {editingGoal ? 'Edit Goal' : 'Create New Goal'}
        </h1>
      </div>
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

  const handleGoToDashboard = () => setCurrentView('dashboard');
  return (
    <Layout onSettingsClick={() => console.log('Settings clicked')} onLogoClick={handleGoToDashboard}>
      {/* First Time Setup Modal */}
      {isFirstTime && <FirstTimeSetup onNameSubmit={saveName} />}

      {/* Goal Planning Modal */}
      <GoalPlanningModal
        isOpen={isGoalPlanningModalOpen}
        onClose={() => setIsGoalPlanningModalOpen(false)}
        onStrategySelected={handleGoalPlanningModalStrategySelected}
      />

      {/* Goal Details Modal */}
      <GoalDetailsModal
        isOpen={!!selectedGoalForDetails}
        onClose={handleCloseGoalDetails}
        goal={selectedGoalForDetails}
        tasks={selectedGoalForDetails ? getTasksForGoal(selectedGoalForDetails.id) : []}
        onUpdateTask={updateTask}
        onAddTask={addTask}
        onDeleteTask={deleteTask}
      />



      {/* Main Content */}
      {currentView === 'dashboard' && renderDashboard()}
      {currentView === 'create-goal' && renderCreateGoal()}
      {currentView === 'ai-planner' && (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setCurrentView('dashboard')}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              ← Back to Dashboard
            </Button>
            <h1 className="text-2xl font-semibold text-white">AI Goal Planner</h1>
          </div>
          <AIGoalPlanner
            onPlanSelected={(strategy, analysis) => {
              // Convert AI plan to GoalFormData format
              const goalData: GoalFormData = {
                title: analysis.parsedGoal.title,
                description: `AI Generated Plan: ${strategy.name}\n\n${strategy.description}`,
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(Date.now() + analysis.parsedGoal.timeframe * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                estimatedDailyTimeMinutes: analysis.parsedGoal.dailyTime,
                estimatedDailyTime: `${Math.floor(analysis.parsedGoal.dailyTime / 60).toString().padStart(2, '0')}:${(analysis.parsedGoal.dailyTime % 60).toString().padStart(2, '0')} AM`,
                priority: 'medium' as const,
                tags: ['AI Generated', strategy.name],
              };

              const newGoal = createGoal(goalData);
              createTasksFromAIPlan(newGoal, strategy);
              setCurrentView('dashboard');
            }}
            onCancel={() => setCurrentView('dashboard')}
          />
        </div>
      )}
      {currentView === 'goals' && renderGoals()}
      {currentView === 'today' && renderTodaysTasks()}
    </Layout>
  );
}

export default App;