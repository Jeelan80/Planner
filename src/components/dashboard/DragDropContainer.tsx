import React, { useState, useCallback } from 'react';
import { DashboardCard } from '../../types/dashboard';
import { Goal, Task } from '../../types';
import { DraggableCard } from './DraggableCard';

interface DragDropContainerProps {
  cards: DashboardCard[];
  isCustomizing: boolean;
  // when true, drag/reorder and bin drop are enabled; if omitted, falls back to `isCustomizing`
  dragEnabled?: boolean;
  onReorderCards: (cardIds: string[]) => void;
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

export const DragDropContainer: React.FC<DragDropContainerProps> = ({
  cards,
  isCustomizing,
  dragEnabled,
  onReorderCards,
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
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [isOverBin, setIsOverBin] = useState(false);
  // Preview ordering while dragging for immediate swap feedback
  const [previewCards, setPreviewCards] = useState<DashboardCard[] | null>(null);

  // Ensure drag state is cleared if a drag ends anywhere (e.g., user drops outside targets)
  React.useEffect(() => {
    if (!draggedCardId) return;

    const clearDrag = () => {
      setDraggedCardId(null);
      setDraggedIndex(null);
      setDropTargetIndex(null);
      setIsOverBin(false);
    };

    window.addEventListener('dragend', clearDrag);
    window.addEventListener('drop', clearDrag);

    return () => {
      window.removeEventListener('dragend', clearDrag);
      window.removeEventListener('drop', clearDrag);
    };
  }, [draggedCardId]);

  // Determine whether dragging behavior is currently enabled. Prefer explicit prop.
  const dragging = typeof dragEnabled === 'boolean' ? dragEnabled : isCustomizing;

  const handleDragStart = useCallback((cardId: string, index: number) => {
    setDraggedCardId(cardId);
    setDraggedIndex(index);
    // initialize preview to current cards order
    setPreviewCards(cards.slice());
  }, [cards]);

  const handleDragEnd = useCallback(() => {
    // If a preview ordering exists and it's different from the current order, commit it.
    if (previewCards) {
      const previewIds = previewCards.map(c => c.id);
      const currentIds = cards.map(c => c.id);
      const different = previewIds.length !== currentIds.length || previewIds.some((id, i) => id !== currentIds[i]);
      if (different) {
        onReorderCards(previewIds);
      }
    } else if (draggedIndex !== null && dropTargetIndex !== null && draggedIndex !== dropTargetIndex) {
      const finalOrder = cards.map(card => card.id);
      onReorderCards(finalOrder);
    }

    // Reset drag state and preview
    setDraggedCardId(null);
    setDraggedIndex(null);
    setDropTargetIndex(null);
    setPreviewCards(null);
  }, [cards, draggedIndex, dropTargetIndex, onReorderCards, previewCards]);

  const handleDragOver = useCallback((index: number) => {
    if (draggedCardId === null) return;

    // index === -1 indicates the dragged pointer left a card — clear drop target
    if (index === -1) {
      setDropTargetIndex(null);
      return;
    }

    // compute preview reorder using current preview or base cards
    const base = (previewCards ?? cards).slice();
    const currentIdx = base.findIndex(c => c.id === draggedCardId);
    const from = currentIdx >= 0 ? currentIdx : (draggedIndex ?? -1);
    if (from === -1 || index === from) {
      setDropTargetIndex(index);
      return;
    }

    // remove and insert
    const [moved] = base.splice(from, 1);
    base.splice(index, 0, moved);
    setPreviewCards(base);
    setDropTargetIndex(index);
  }, [draggedIndex, cards, previewCards, draggedCardId]);

  const handleBinDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsOverBin(true);
  };

  const handleBinDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOverBin(false);
  };

  const handleBinDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOverBin(false);

    // read card id from dataTransfer
    const cardId = e.dataTransfer.getData('application/x-card-id') || e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('text/html');
    if (cardId) {
      onDelete(cardId);
    }

    // reset drag state
    setDraggedCardId(null);
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-min">
  {(previewCards ?? cards).map((card, index) => (
        <DraggableCard
          key={card.id}
          card={card}
      index={index}
          // pass real customization flag for card UI controls
          isCustomizing={isCustomizing}
          // enable dragging behavior independently
          draggingEnabled={dragging}
          isDragging={draggedCardId === card.id}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onEdit={onEdit}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          goals={goals}
          tasks={tasks}
          getTasksForGoal={getTasksForGoal}
          getTodaysTasks={getTodaysTasks}
          getOverdueTasks={getOverdueTasks}
          onToggleTask={onToggleTask}
        />
      ))}
    {/* Trash bin drop target - visible when dragging is enabled */}
  {dragging && draggedCardId && (
        <div
          onDragOver={handleBinDragOver}
          onDragEnter={handleBinDragOver}
          onDragLeave={handleBinDragLeave}
          onDrop={handleBinDrop}
          className={`col-span-1 md:col-span-2 xl:col-span-3 transition-all duration-150 p-4 rounded-lg flex items-center justify-center border-2 border-dashed ${isOverBin ? 'bg-red-600/20 border-red-400' : 'bg-transparent border-gray-700/30'}`}>
          <div className="flex items-center space-x-3 text-sm text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22" />
            </svg>
            <span>{isOverBin ? 'Release to delete card' : 'Drag here to remove card'}</span>
          </div>
        </div>
      )}
    </div>
  );
};