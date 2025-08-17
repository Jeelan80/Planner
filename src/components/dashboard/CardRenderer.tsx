import React from 'react';
import { DashboardCard } from '../../types/dashboard';
import { Goal, Task } from '../../types';
import { PhotoCard } from './cards/PhotoCard';
import { MotivationalQuoteCard } from './cards/MotivationalQuoteCard';
import { ProjectProgressCard } from './cards/ProjectProgressCard';
import { QuickNotesCard } from './cards/QuickNotesCard';
import { TaskSummaryCard } from './cards/TaskSummaryCard';

interface CardRendererProps {
  card: DashboardCard;
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

export const CardRenderer: React.FC<CardRendererProps> = ({
  card,
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
  const commonProps = {
    card,
    isCustomizing,
    onUpdate,
    onDelete,
    onEdit,
  };

  switch (card.type) {
    case 'photo':
      return <PhotoCard {...commonProps} />;
    
    case 'quote':
      return <MotivationalQuoteCard {...commonProps} />;
    
    case 'progress':
      return (
        <ProjectProgressCard
          {...commonProps}
          goals={goals}
          getTasksForGoal={getTasksForGoal}
        />
      );
    
    case 'notes':
      return <QuickNotesCard {...commonProps} />;
    
    case 'tasks':
      return (
        <TaskSummaryCard
          {...commonProps}
          tasks={tasks}
          getTodaysTasks={getTodaysTasks}
          getOverdueTasks={getOverdueTasks}
          onToggleTask={onToggleTask}
        />
      );
    
    default:
      return (
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
          <p className="text-white/70">Unknown card type: {card.type}</p>
        </div>
      );
  }
};