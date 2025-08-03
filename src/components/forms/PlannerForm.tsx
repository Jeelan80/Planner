// Form component for creating goals

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

export const PlannerForm: React.FC<PlannerFormProps> = ({
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

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
            <Plus className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {initialData ? 'Edit Goal' : 'Create New Goal'}
          </h2>
        </div>

        {/* Goal Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            <span className="text-gray-900">Goal Title *</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="What do you want to achieve?"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            <span className="text-gray-900">Description</span> <span className="ml-1 text-xs font-semibold text-purple-500 bg-purple-50 px-2 py-0.5 rounded">optional</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe your goal in detail..."
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
            <span className="text-gray-900">Start Date *</span>
            </label>
            <DatePicker
              selected={formData.startDate ? new Date(formData.startDate) : new Date()}
              onChange={(date: Date | null) => handleDateChange(date, 'startDate')}
              selectsStart
              startDate={formData.startDate ? new Date(formData.startDate) : new Date()}
              endDate={formData.endDate ? new Date(formData.endDate) : null}
              dateFormat="yyyy-MM-dd"
              className="date-picker-enhanced w-full pl-10 pr-10 py-2 border border-blue-200 rounded-xl shadow focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white/60 backdrop-blur-md text-slate-900 font-semibold"
              placeholderText="Select start date"
              showPopperArrow={false}
              popperClassName="date-picker-popper"
              isClearable
              todayButton="Today"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
            <span className="text-gray-900">End Date *</span>
            </label>
            <DatePicker
              selected={formData.endDate ? new Date(formData.endDate) : null}
              onChange={(date: Date | null) => handleDateChange(date, 'endDate')}
              selectsEnd
              startDate={formData.startDate ? new Date(formData.startDate) : new Date()}
              endDate={formData.endDate ? new Date(formData.endDate) : null}
              minDate={formData.startDate ? new Date(formData.startDate) : new Date()}
              dateFormat="yyyy-MM-dd"
              className="date-picker-enhanced w-full pl-10 pr-10 py-2 border border-blue-200 rounded-xl shadow focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white/60 backdrop-blur-md text-slate-900 font-semibold"
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
            <label htmlFor="estimatedDailyTime" className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 inline mr-1 text-gray-900" />
            <span className="text-gray-900">Daily Time *</span>
            </label>
            <TimePickerInput
              value={formData.estimatedDailyTime}
              onChange={handleTimeChange}
            />
            <p className="text-xs text-gray-500 mt-1">
              <span className="block mt-00 text-sm font-semibold text-purple-700 bg-purple-50 px-2 py-1 rounded-lg shadow-sm">Selected: {formData.estimatedDailyTime}</span>
            </p>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
            <span className="text-gray-900">Priority</span>
            </label>
            <div className="relative">
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-900 font-semibold shadow focus:ring-4 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200 appearance-none pr-10 custom-priority-select"
              >
                <option value="low" className="text-green-600 font-bold">🟢 Low</option>
                <option value="medium" className="text-yellow-600 font-bold">🟡 Medium</option>
                <option value="high" className="text-red-600 font-bold">🔴 High</option>
              </select>
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M6 9l6 6 6-6"/></svg>
              </span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="text-gray-900">Tags</span> <span className="ml-1 text-xs font-semibold text-purple-500 bg-purple-50 px-2 py-0.5 rounded">optional</span>
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleTagKeyPress}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add a tag..."
            />
            <Button type="button" onClick={addTag} variant="outline" size="sm">
              Add
            </Button>
          </div>
          
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" loading={loading}>
            {initialData ? 'Update Goal' : 'Create Goal'}
          </Button>
        </div>
      </form>
    </Card>
  );
};