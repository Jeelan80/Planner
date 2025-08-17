import React, { useState, useCallback } from 'react';
import { DashboardCard } from '../../types/dashboard';
import { Goal, Task } from '../../types';
import { DraggableCard } from './DraggableCard';

interface DragDropContainerProps {
  cards: DashboardCard[];
  isCustomizing: boolean;
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

  const handleDragStart = useCallback((cardId: string, index: number) => {
    setDraggedCardId(cardId);
    setDraggedIndex(index);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (draggedIndex !== null && dropTargetIndex !== null && draggedIndex !== dropTargetIndex) {
      // Reorder the cards
      const newCards = [...cards];
      const [draggedCard] = newCards.splice(draggedIndex, 1);
      newCards.splice(dropTargetIndex, 0, draggedCard);
      
      // Update the order
      onReorderCards(newCards.map(card => card.id));
    }

    // Reset drag state
    setDraggedCardId(null);
    setDraggedIndex(null);
    setDropTargetIndex(null);
  }, [cards, draggedIndex, dropTargetIndex, onReorderCards]);

  const handleDragOver = useCallback((index: number) => {
    if (draggedIndex !== null && index !== draggedIndex) {
      setDropTargetIndex(index);
    }
  }, [draggedIndex]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-min">
      {cards.map((card, index) => (
        <DraggableCard
          key={card.id}
          card={card}
          index={index}
          isCustomizing={isCustomizing}
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
    </div>
  );
};