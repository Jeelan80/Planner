// Goal Details Modal component for viewing and editing daily tasks

import React, { useState, useCallback } from 'react';
import { Button } from '../common/Button';
import { Goal, Task } from '../../types';
import { X, Calendar, Clock, Target, Edit3, Save, CheckCircle, Plus, Trash2 } from 'lucide-react';

interface GoalDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask?: (taskId: string) => void;
  onAddTask?: (goalId: string, task: Omit<Task, 'id' | 'goalId'>) => void;
}

export const GoalDetailsModal: React.FC<GoalDetailsModalProps> = ({
  isOpen,
  onClose,
  goal,
  tasks,
  onUpdateTask,
  onDeleteTask,
  onAddTask,
}) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Partial<Task>>({});
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'goalId'>>({
    title: '',
    description: '',
    scheduledDate: new Date(),
    estimatedTimeMinutes: 60,
    completed: false,
    order: 0,
    category: 'daily',
  });

  const handleEditTask = useCallback((task: Task) => {
    setEditingTaskId(task.id);
    setEditingTask({ ...task });
  }, []);

  const handleSaveTask = useCallback(() => {
    if (editingTaskId && editingTask) {
      onUpdateTask(editingTaskId, editingTask);
      setEditingTaskId(null);
      setEditingTask({});
    }
  }, [editingTaskId, editingTask, onUpdateTask]);

  const handleCancelEdit = useCallback(() => {
    setEditingTaskId(null);
    setEditingTask({});
  }, []);

  const handleToggleComplete = useCallback((taskId: string, completed: boolean) => {
    onUpdateTask(taskId, { completed });
  }, [onUpdateTask]);

  const handleAddTask = useCallback(() => {
    if (goal && newTask.title.trim()) {
      onAddTask?.(goal.id, newTask);
      setNewTask({
        title: '',
        description: '',
        scheduledDate: new Date(),
        estimatedTimeMinutes: 60,
        completed: false,
        order: 0,
        category: 'daily',
      });
      setIsAddingTask(false);
    }
  }, [goal, newTask, onAddTask]);

  const handleDeleteTask = useCallback((taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDeleteTask?.(taskId);
    }
  }, [onDeleteTask]);

  // Sort tasks by scheduled date
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
  const completedTasks = tasks.filter(t => t.completed);
  const progress = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

  if (!isOpen || !goal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 pt-20">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[85vh] border border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-5 rounded-t-xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {goal.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {completedTasks.length}/{tasks.length} tasks completed ({Math.round(progress)}%)
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 bg-red-50 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-gray-600 rounded-lg text-red-600 dark:text-gray-100 hover:text-red-700 dark:hover:text-white border-2 border-red-200 dark:border-gray-500 hover:border-red-300 dark:hover:border-gray-400 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <X className="w-5 h-5 stroke-2" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Goal Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-xl p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Duration</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {goal.startDate.toLocaleDateString()} - {goal.endDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Daily Time</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {Math.floor(goal.estimatedDailyTimeMinutes / 60)}h {goal.estimatedDailyTimeMinutes % 60}m
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Priority</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                      {goal.priority}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Progress</h3>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.round(progress)}% complete
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Add Task Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Tasks</h3>
              {onAddTask && (
                <Button
                  onClick={() => setIsAddingTask(true)}
                  className="bg-green-500 hover:bg-green-600"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              )}
            </div>

            {/* Add New Task Form */}
            {isAddingTask && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-xl p-4">
                <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Add New Task</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <textarea
                    placeholder="Task description (optional)"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  />
                  <div className="flex space-x-3">
                    <input
                      type="date"
                      value={newTask.scheduledDate.toISOString().split('T')[0]}
                      onChange={(e) => setNewTask({ ...newTask, scheduledDate: new Date(e.target.value) })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <input
                      type="number"
                      placeholder="Minutes"
                      value={newTask.estimatedTimeMinutes}
                      onChange={(e) => setNewTask({ ...newTask, estimatedTimeMinutes: parseInt(e.target.value) || 60 })}
                      className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleAddTask} className="bg-green-500 hover:bg-green-600" size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Add Task
                    </Button>
                    <Button onClick={() => setIsAddingTask(false)} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Tasks List */}
            <div className="space-y-3">
              {sortedTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No tasks yet. Add your first task to get started!</p>
                </div>
              ) : (
                sortedTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 ${task.completed ? 'opacity-75' : ''
                      }`}
                  >
                    {editingTaskId === task.id ? (
                      // Edit Mode
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editingTask.title || ''}
                          onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium"
                        />
                        <textarea
                          value={editingTask.description || ''}
                          onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                          placeholder="Task description"
                        />
                        <div className="flex items-center space-x-3">
                          <input
                            type="date"
                            value={editingTask.scheduledDate ? new Date(editingTask.scheduledDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => setEditingTask({ ...editingTask, scheduledDate: new Date(e.target.value) })}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                          <input
                            type="number"
                            value={editingTask.estimatedTimeMinutes || 0}
                            onChange={(e) => setEditingTask({ ...editingTask, estimatedTimeMinutes: parseInt(e.target.value) || 0 })}
                            className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Minutes"
                          />
                          <span className="text-sm text-gray-500 dark:text-gray-400">minutes</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleSaveTask} className="bg-blue-500 hover:bg-blue-600" size="sm">
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                          <Button onClick={handleCancelEdit} variant="outline" size="sm">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="flex items-start space-x-3">
                        <button
                          onClick={() => handleToggleComplete(task.id, !task.completed)}
                          className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${task.completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                            }`}
                        >
                          {task.completed && <CheckCircle className="w-3 h-3 text-white" />}
                        </button>
                        <div className="flex-1">
                          <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className={`text-sm mt-1 ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'}`}>
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {task.scheduledDate.toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {task.estimatedTimeMinutes}min
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            onClick={() => handleEditTask(task)}
                            variant="ghost"
                            size="sm"
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          {onDeleteTask && (
                            <Button
                              onClick={() => handleDeleteTask(task.id)}
                              variant="ghost"
                              size="sm"
                              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};