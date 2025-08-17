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
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 pt-20">
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-4xl w-full max-h-[85vh] border border-gray-200 dark:border-gray-700 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-5 rounded-t-xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {goal.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {completedTasks.length}/{tasks.length} tasks completed ({Math.round(progress)}%)
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border-2 border-red-200 dark:border-red-700/50 hover:border-red-300 dark:hover:border-red-600 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <X className="w-5 h-5 stroke-2" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="space-y-6">
            {/* Goal Info */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700/50 rounded-xl p-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Duration</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {goal.startDate.toLocaleDateString()} - {goal.endDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Daily Time</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {Math.floor(goal.estimatedDailyTimeMinutes / 60)}h {goal.estimatedDailyTimeMinutes % 60}m
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Priority</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                      {goal.priority}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Progress</h3>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                  {Math.round(progress)}% complete
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 h-3 rounded-full transition-all duration-300 shadow-sm"
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
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              )}
            </div>

            {/* Add New Task Form */}
            {isAddingTask && (
              <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/30 dark:to-green-800/20 border border-green-200 dark:border-green-700/50 rounded-xl p-4 shadow-sm">
                <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Add New Task</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
                  />
                  <textarea
                    placeholder="Task description (optional)"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none shadow-sm transition-all duration-200"
                  />
                  <div className="flex space-x-3">
                    <input
                      type="date"
                      value={newTask.scheduledDate.toISOString().split('T')[0]}
                      onChange={(e) => setNewTask({ ...newTask, scheduledDate: new Date(e.target.value) })}
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm transition-all duration-200"
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        placeholder="Minutes"
                        value={newTask.estimatedTimeMinutes}
                        onChange={(e) => setNewTask({ ...newTask, estimatedTimeMinutes: parseInt(e.target.value) || 60 })}
                        className="w-24 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">min</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleAddTask} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 text-white shadow-md hover:shadow-lg transition-all duration-200" size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Add Task
                    </Button>
                    <Button onClick={() => setIsAddingTask(false)} variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Tasks List */}
            <div className="space-y-3">
              {sortedTasks.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
                  <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium">No tasks yet</p>
                  <p className="text-sm mt-1">Add your first task to get started!</p>
                </div>
              ) : (
                sortedTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 ${task.completed ? 'opacity-75 bg-gray-50 dark:bg-gray-800/50' : ''
                      }`}
                  >
                    {editingTaskId === task.id ? (
                      // Edit Mode
                      <div className="space-y-3 bg-blue-50/50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700/50">
                        <input
                          type="text"
                          value={editingTask.title || ''}
                          onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
                        />
                        <textarea
                          value={editingTask.description || ''}
                          onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                          rows={2}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none shadow-sm transition-all duration-200"
                          placeholder="Task description"
                        />
                        <div className="flex items-center space-x-3">
                          <input
                            type="date"
                            value={editingTask.scheduledDate ? new Date(editingTask.scheduledDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => setEditingTask({ ...editingTask, scheduledDate: new Date(e.target.value) })}
                            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm transition-all duration-200"
                          />
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={editingTask.estimatedTimeMinutes || 0}
                              onChange={(e) => setEditingTask({ ...editingTask, estimatedTimeMinutes: parseInt(e.target.value) || 0 })}
                              className="w-24 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
                              placeholder="Minutes"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">min</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleSaveTask} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200" size="sm">
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                          <Button onClick={handleCancelEdit} variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="flex items-start space-x-3">
                        <button
                          onClick={() => handleToggleComplete(task.id, !task.completed)}
                          className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${task.completed
                            ? 'bg-gradient-to-br from-green-500 to-green-600 border-green-500 shadow-md'
                            : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                            }`}
                        >
                          {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
                        </button>
                        <div className="flex-1">
                          <h4 className={`font-semibold text-base ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className={`text-sm mt-1 leading-relaxed ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 mt-3 text-xs">
                            <span className={`flex items-center px-2 py-1 rounded-md ${task.completed ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                              <Calendar className="w-3 h-3 mr-1" />
                              {task.scheduledDate.toLocaleDateString()}
                            </span>
                            <span className={`flex items-center px-2 py-1 rounded-md ${task.completed ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400' : 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'}`}>
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
                            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all duration-200"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          {onDeleteTask && (
                            <Button
                              onClick={() => handleDeleteTask(task.id)}
                              variant="ghost"
                              size="sm"
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-all duration-200"
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