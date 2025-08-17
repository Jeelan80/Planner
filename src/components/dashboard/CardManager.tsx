import React, { useState } from 'react';
import { DashboardCard } from '../../types/dashboard';
import { Goal, Task } from '../../types';
import { CardRenderer } from './CardRenderer';
import { Button } from '../common/Button';
import { Trash2, AlertTriangle } from 'lucide-react';

interface CardManagerProps {
  cards: DashboardCard[];
  isCustomizing: boolean;
  onUpdate: (cardId: string, updates: Partial<DashboardCard>) => void;
  onDelete: (cardId: string) => void;
  onEdit: (cardId: string) => void;
  // Additional props for specific card types
  goals?: Goal[];
  tasks?: Task[];
  getTasksForGoal?: (goalId: string) => Task[];
  getTodaysTasks?: () => Task[];
  getOverdueTasks?: () => Task[];
  onToggleTask?: (taskId: string, completed: boolean) => void;
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cardType: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  cardType,
}) => {
  if (!isOpen) return null;

  const getCardTypeName = (type: string) => {
    switch (type) {
      case 'photo':
        return 'Photo Card';
      case 'quote':
        return 'Quote Card';
      case 'progress':
        return 'Progress Card';
      case 'notes':
        return 'Notes Card';
      case 'tasks':
        return 'Task Summary Card';
      default:
        return 'Card';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete {getCardTypeName(cardType)}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This action cannot be undone
              </p>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Are you sure you want to delete this {getCardTypeName(cardType).toLowerCase()}? 
            All data associated with this card will be permanently removed.
          </p>

          <div className="flex space-x-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Card
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CardManager: React.FC<CardManagerProps> = ({
  cards,
  isCustomizing,
  onUpdate,
  onDelete,
  onEdit,
  goals = [],
  tasks = [],
  getTasksForGoal = () => [],
  getTodaysTasks = () => [],
  getOverdueTasks = () => [],
  onToggleTask = () => {},
}) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    cardId: string;
    cardType: string;
  } | null>(null);

  const handleDeleteClick = (cardId: string, cardType: string) => {
    setDeleteConfirmation({ cardId, cardType });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmation) {
      onDelete(deleteConfirmation.cardId);
      setDeleteConfirmation(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation(null);
  };

  // Enhanced delete handler that shows confirmation
  const enhancedOnDelete = (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (card) {
      handleDeleteClick(cardId, card.type);
    }
  };

  return (
    <>
      {cards.map((card) => (
        <div
          key={card.id}
          className="relative group"
          data-card-id={card.id}
        >
          <CardRenderer
            card={card}
            isCustomizing={isCustomizing}
            onUpdate={onUpdate}
            onDelete={enhancedOnDelete}
            onEdit={onEdit}
            goals={goals}
            tasks={tasks}
            getTasksForGoal={getTasksForGoal}
            getTodaysTasks={getTodaysTasks}
            getOverdueTasks={getOverdueTasks}
            onToggleTask={onToggleTask}
          />
        </div>
      ))}

      <DeleteConfirmationModal
        isOpen={!!deleteConfirmation}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        cardType={deleteConfirmation?.cardType || ''}
      />
    </>
  );
};