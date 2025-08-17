import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { StickyNote, Edit3, Trash2, X, Plus, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { DashboardCard } from '../../../types/dashboard';
import { Button } from '../../common/Button';
import styles from './QuickNotesCard.module.css';

interface QuickNotesCardProps {
  card: DashboardCard;
  isCustomizing: boolean;
  onUpdate: (cardId: string, updates: Partial<DashboardCard>) => void;
  onDelete: (cardId: string) => void;
  onEdit: (cardId: string) => void;
}

interface NotesEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, content: string, color: string) => void;
  initialData?: {
    title: string;
    content: string;
    color?: string;
  };
}

const COLOR_OPTIONS = [
  { name: 'Default', value: 'default', bg: 'bg-white/10', border: 'border-white/20' },
  { name: 'Blue', value: 'blue', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
  { name: 'Green', value: 'green', bg: 'bg-green-500/20', border: 'border-green-500/30' },
  { name: 'Yellow', value: 'yellow', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
  { name: 'Purple', value: 'purple', bg: 'bg-purple-500/20', border: 'border-purple-500/30' },
  { name: 'Pink', value: 'pink', bg: 'bg-pink-500/20', border: 'border-pink-500/30' },
  { name: 'Red', value: 'red', bg: 'bg-red-500/20', border: 'border-red-500/30' },
];

const NotesEditModal: React.FC<NotesEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [selectedColor, setSelectedColor] = useState(initialData?.color || 'default');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      alert('Please enter a title or content');
      return;
    }
    onSave(title.trim() || 'Untitled Note', content.trim(), selectedColor);
    onClose();
  };

  // Block body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedColorOption = COLOR_OPTIONS.find(option => option.value === selectedColor) || COLOR_OPTIONS[0];

  const modalContent = (
    <div className={styles.modal}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {initialData ? 'Edit Note' : 'Create Quick Note'}
            </h3>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="bg-transparent"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">{title.length}/100 characters</p>
            </div>

            {/* Content Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content
              </label>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note here..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[120px]"
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">{content.length}/1000 characters</p>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Note Color
              </label>
              <div className="grid grid-cols-4 gap-2">
                {COLOR_OPTIONS.map((colorOption) => (
                  <button
                    key={colorOption.value}
                    onClick={() => setSelectedColor(colorOption.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedColor === colorOption.value
                        ? 'border-blue-500 ring-2 ring-blue-500/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className={`w-full h-8 rounded ${colorOption.bg} ${colorOption.border} border`}></div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center">
                      {colorOption.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preview
              </label>
              <div className={`p-4 rounded-lg border ${selectedColorOption.bg} ${selectedColorOption.border}`}>
                <h4 className="font-semibold text-white mb-2">
                  {title || 'Untitled Note'}
                </h4>
                <p className="text-white/90 text-sm whitespace-pre-wrap">
                  {content || 'Your note content will appear here...'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 mt-6">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {initialData ? 'Update Note' : 'Save Note'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export const QuickNotesCard: React.FC<QuickNotesCardProps> = ({
  card,
  isCustomizing,
  onUpdate,
  onDelete,
  // onEdit is unused
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');

  const notesConfig = card.config.notes;

  const handleSaveNote = (title: string, content: string, color: string) => {
    onUpdate(card.id, {
      config: {
        ...card.config,
        notes: {
          title,
          content,
          color,
        },
      },
    });
  };

  const handleQuickEdit = () => {
    setEditContent(notesConfig?.content || '');
    setIsEditing(true);
  };

  const handleSaveQuickEdit = () => {
    if (notesConfig) {
      handleSaveNote(notesConfig.title, editContent, notesConfig.color || 'default');
    }
    setIsEditing(false);
  };

  const handleCancelQuickEdit = () => {
    setIsEditing(false);
    setEditContent('');
  };

  // If no note configured, show setup state
  if (!notesConfig?.title && !notesConfig?.content) {
    return (
      <>
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-200 group relative min-h-[320px] w-full flex flex-col justify-center">
          {isCustomizing && (
            <div className="absolute top-2 right-2 flex space-x-1 opacity-100 transition-opacity">
              <Button
                onClick={() => onDelete(card.id)}
                variant="outline"
                size="sm"
                className="bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}

          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg mx-auto mb-4">
              <StickyNote className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Quick Notes</h3>
            <p className="text-white/70 text-sm mb-4 px-2">
              Jot down important thoughts and reminders
            </p>
            <Button
              onClick={() => setShowEditModal(true)}
              size="sm"
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Note
            </Button>
          </div>
        </div>

        <NotesEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveNote}
        />
      </>
    );
  }

  const colorOption = COLOR_OPTIONS.find(option => option.value === notesConfig.color) || COLOR_OPTIONS[0];
  const shouldTruncate = notesConfig.content.length > 150;
  const displayContent = shouldTruncate && !isExpanded 
    ? notesConfig.content.substring(0, 150) + '...'
    : notesConfig.content;

  return (
    <>
      <div className={`backdrop-blur-sm border rounded-xl p-4 hover:bg-opacity-80 transition-all duration-200 group relative min-h-[320px] w-full flex flex-col ${colorOption.bg} ${colorOption.border}`}>
        {isCustomizing && (
          <div className="absolute top-2 right-2 flex space-x-1 opacity-100 transition-opacity">
            <Button
              onClick={() => setShowEditModal(true)}
              variant="outline"
              size="sm"
              className="bg-blue-500/20 border-blue-500/30 text-blue-300 hover:bg-blue-500/30"
            >
              <Edit3 className="w-3 h-3" />
            </Button>
            <Button
              onClick={() => onDelete(card.id)}
              variant="outline"
              size="sm"
              className="bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        )}

        <div className="space-y-3 flex-1">
          {/* Note Header */}
          <div className="flex items-center space-x-2">
            <StickyNote className="w-5 h-5 text-white/80" />
            <h3 className="font-semibold text-white truncate flex-1">
              {notesConfig.title}
            </h3>
          </div>

          {/* Note Content */}
          <div className="space-y-2 flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-2 py-1 bg-white/20 border border-white/30 rounded text-white placeholder-white/60 text-sm resize-none"
                  rows={6}
                  maxLength={1000}
                  aria-label="Note content"
                  title="Edit note content"
                  placeholder="Enter your note content here..."
                />
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSaveQuickEdit}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-xs"
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                  <Button
                    onClick={handleCancelQuickEdit}
                    variant="outline"
                    size="sm"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-hidden">
                  <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                    {displayContent}
                  </p>
                </div>
                
                {/* Expand/Collapse Button */}
                {shouldTruncate && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center space-x-1 text-white/70 hover:text-white text-xs transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-3 h-3" />
                        <span>Show less</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" />
                        <span>Show more</span>
                      </>
                    )}
                  </button>
                )}

                {/* Quick Edit Button */}
                {!isCustomizing && (
                  <button
                    onClick={handleQuickEdit}
                    className="flex items-center space-x-1 text-white/60 hover:text-white text-xs transition-colors mt-2"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Quick edit</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <NotesEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveNote}
        initialData={notesConfig}
      />
    </>
  );
};