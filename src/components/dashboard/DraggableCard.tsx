import React, { useState, useRef } from 'react';
import { DashboardCard } from '../../types/dashboard';
import { Goal, Task } from '../../types';
import { CardRenderer } from './CardRenderer';
import { Move } from 'lucide-react';

interface DraggableCardProps {
  card: DashboardCard;
  index: number;
  isCustomizing: boolean;
  isDragging: boolean;
  onUpdate: (cardId: string, updates: Partial<DashboardCard>) => void;
  onDelete: (cardId: string) => void;
  onEdit: (cardId: string) => void;
  onDragStart: (cardId: string, index: number) => void;
  onDragEnd: () => void;
  onDragOver: (index: number) => void;
  // Additional props for specific card types
  goals?: Goal[];
  tasks?: Task[];
  getTasksForGoal?: (goalId: string) => Task[];
  getTodaysTasks?: () => Task[];
  getOverdueTasks?: () => Task[];
  onToggleTask?: (taskId: string, completed: boolean) => void;
}

export const DraggableCard: React.FC<DraggableCardProps> = ({
  card,
  index,
  isCustomizing,
  isDragging,
  onUpdate,
  onDelete,
  onEdit,
  onDragStart,
  onDragEnd,
  onDragOver,
  goals = [],
  tasks = [],
  getTasksForGoal = () => [],
  getTodaysTasks = () => [],
  getOverdueTasks = () => [],
  onToggleTask = () => {},
}) => {
  const [dragOver, setDragOver] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    if (!isCustomizing) {
      e.preventDefault();
      return;
    }
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', card.id);
    onDragStart(card.id, index);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.preventDefault();
    onDragEnd();
    setDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!dragOver) {
      setDragOver(true);
      onDragOver(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only set dragOver to false if we're leaving the card entirely
    const rect = dragRef.current?.getBoundingClientRect();
    if (rect) {
      const { clientX, clientY } = e;
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        setDragOver(false);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div
      ref={dragRef}
      draggable={isCustomizing}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative transition-all duration-200
        ${isCustomizing ? 'cursor-move' : 'cursor-default'}
        ${isDragging ? 'opacity-50 scale-95 rotate-2' : 'opacity-100 scale-100 rotate-0'}
        ${dragOver && isCustomizing ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
      `}
    >
      {/* Drag Handle - Only visible when customizing */}
      {isCustomizing && (
        <div className="absolute -top-2 -right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-blue-500 text-white p-1 rounded-full shadow-lg">
            <Move className="w-3 h-3" />
          </div>
        </div>
      )}

      {/* Drop Zone Indicator */}
      {dragOver && isCustomizing && (
        <div className="absolute inset-0 bg-blue-500/20 border-2 border-dashed border-blue-500 rounded-xl z-10 flex items-center justify-center">
          <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Drop here
          </div>
        </div>
      )}

      <CardRenderer
        card={card}
        isCustomizing={isCustomizing}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onEdit={onEdit}
        goals={goals}
        tasks={tasks}
        getTasksForGoal={getTasksForGoal}
        getTodaysTasks={getTodaysTasks}
        getOverdueTasks={getOverdueTasks}
        onToggleTask={onToggleTask}
      />
    </div>
  );
};