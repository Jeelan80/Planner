// BACKUP: Full functionality PlannerForm with TimePickerInput
// This is the complete version with time picker functionality
// Saved for future use - DO NOT IMPORT

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { GoalFormData } from '../../types';
import { Plus, Clock } from 'lucide-react';
import { TimePickerInput } from './TimePickerInput';

interface PlannerFormProps {
  onSubmit: (goalData: GoalFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<GoalFormData>;
  loading?: boolean;
}

export const PlannerFormWithTimePicker: React.FC<PlannerFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  loading = false,
}) => {
  const [formData, setFormData] = useState<GoalFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    endDate: initialData?.endDate || '',
    estimatedDailyTimeMinutes: initialData?.estimatedDailyTimeMinutes || 60,
    estimatedDailyTime: initialData?.estimatedDailyTime || '07:00 AM',
    priority: initialData?.priority || 'medium',
    tags: initialData?.tags || [],
  });

  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estimatedDailyTimeMinutes' ? Number(value) : value,
    }));
  };

  const handleTimeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      estimatedDailyTime: value,
    }));
  };

  const handleDateChange = (date: Date | null, field: 'startDate' | 'endDate') => {
    setFormData(prev => ({
      ...prev,
      [field]: date
        ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
        : '',
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {initialData ? 'Edit Goal' : 'Create New Goal'}
          </h2>
        </div>

        {/* Goal Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <span className="text-gray-900 dark:text-white">Goal Title *</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white font-medium transition-all duration-200"
            placeholder="What do you want to achieve?"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <span className="text-gray-900 dark:text-white">Description</span> <span className="ml-1 text-xs font-semibold text-purple-500 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded">optional</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white font-medium transition-all duration-200 resize-none"
            placeholder="Describe your goal in detail..."
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <span className="text-gray-900 dark:text-white">Start Date *</span>
            </label>
            <DatePicker
              selected={formData.startDate ? new Date(formData.startDate) : new Date()}
              onChange={(date: Date | null) => handleDateChange(date, 'startDate')}
              selectsStart
              startDate={formData.startDate ? new Date(formData.startDate) : new Date()}
              endDate={formData.endDate ? new Date(formData.endDate) : null}
              dateFormat="yyyy-MM-dd"
              className="date-picker-enhanced w-full pl-4 pr-10 py-3"
              placeholderText="Select start date"
              showPopperArrow={false}
              popperClassName="date-picker-popper"
              isClearable
              todayButton="Today"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <span className="text-gray-900 dark:text-white">End Date *</span>
            </label>
            <DatePicker
              selected={formData.endDate ? new Date(formData.endDate) : null}
              onChange={(date: Date | null) => handleDateChange(date, 'endDate')}
              selectsEnd
              startDate={formData.startDate ? new Date(formData.startDate) : new Date()}
              endDate={formData.endDate ? new Date(formData.endDate) : null}
              minDate={formData.startDate ? new Date(formData.startDate) : new Date()}
              dateFormat="yyyy-MM-dd"
              className="date-picker-enhanced w-full pl-4 pr-10 py-3"
              placeholderText="Select end date"
              showPopperArrow={false}
              popperClassName="date-picker-popper"
              isClearable
              todayButton="Today"
            />
          </div>
        </div>

        {/* Daily Time and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="estimatedDailyTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Clock className="w-4 h-4 inline mr-1 text-gray-900 dark:text-white" />
              <span className="text-gray-900 dark:text-white">Daily Time *</span>
            </label>
            <TimePickerInput
              value={formData.estimatedDailyTime}
              onChange={handleTimeChange}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span className="block mt-2 text-sm font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 px-3 py-2 rounded-lg shadow-sm border border-purple-200 dark:border-purple-700">Selected: {formData.estimatedDailyTime}</span>
            </p>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <span className="text-gray-900 dark:text-white">Priority</span>
            </label>
            <div className="relative">
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="custom-priority-select w-full px-4 py-3 font-semibold shadow focus:ring-4 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200 appearance-none pr-12"
              >
                <option value="low" className="font-bold">🟢 Low Priority</option>
                <option value="medium" className="font-bold">🟡 Medium Priority</option>
                <option value="high" className="font-bold">🔴 High Priority</option>
              </select>
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400 dark:text-purple-300"><path d="M6 9l6 6 6-6" /></svg>
              </span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <span className="text-gray-900 dark:text-white">Tags</span> <span className="ml-1 text-xs font-semibold text-purple-500 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded">optional</span>
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white font-medium transition-all duration-200"
              placeholder="Add a tag..."
            />
            <Button type="button" onClick={addTag} variant="outline" size="sm">
              Add
            </Button>
          </div>

          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-lg font-semibold border border-blue-200 dark:border-blue-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-bold text-lg"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-8 border-t-2 border-gray-200 dark:border-gray-700">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" loading={loading} size="lg" className="px-8">
            {initialData ? 'Update Goal' : 'Create Goal'}
          </Button>
        </div>
      </form>
    </Card>
  );
};